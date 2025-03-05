from services.sql_connection import sql_connect,check_and_create_user_table
from utility.auth_helper import encrypt_password
from utility.auth_bearer import JWTBearer
from model import *

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.responses import JSONResponse
from typing import List, Optional

from datetime import datetime, timedelta
from typing import Optional
import logging
from uuid import uuid4
from services.documentService import log_file_metadata
from services.tabulardataassistant import TabularAssistant
from services.mathassistant import generate_response
import bcrypt
import json
from threading import Thread
from services.documentService import data_ingestion, retrieval
from minio import Minio
import pandas as pd
import json
import os
from io import BytesIO
from PIL import Image
import traceback
import mimetypes
logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


router = APIRouter(prefix="/users", tags=["Users"])


# def hash_password(password: str) -> str:
#     """Hash a plaintext password."""
#     salt = bcrypt.gensalt()
#     return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(signup_request:SignupRequest):
    """user signup"""
    connection = sql_connect()
    cursor = connection.cursor()

    try:
        # Check and create the user table if not exists
        check_and_create_user_table()

        # Check if the email already exists
        check_query = f"""SELECT COUNT(*) FROM users WHERE lower(email) = '{signup_request.email.lower()}'"""
        cursor.execute(check_query)
        result = cursor.fetchone()

        if result[0] > 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=f"User with email '{signup_request.email}' already exists.")
        insert_query = """
        INSERT INTO users (
            name, email, password, created_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP);
        """

        # Execute the query with parameterized inputs
        cursor.execute(
            insert_query,
            (signup_request.name, signup_request.email.lower(), encrypt_password(signup_request.password)))

        connection.commit()
        return JSONResponse(content="User signed up successfully", status_code=201)

    except HTTPException as e:
        logger.error(f"signup- Error in adding User: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="An unexpected error occurred.")
    finally:
        cursor.close()
        connection.close()

ALLOWED_DOMAINS = {"hr", "finance", "marketing", "it", "legal","R&D"}  # Example allowed domains


# dependencies=[Depends(JWTBearer())]
@router.post("/upload/", response_model=List[UploadResponse])
async def upload_files(
    domain: str = Form(...),
    email:str= Form(...),
    files: List[UploadFile] = File(...)):
    """
    Endpoint to upload single or multiple files with a specified domain.

    Args:
        domain (str): The domain to categorize the files (e.g., hr, finance).
        files (List[UploadFile]): List of files to be uploaded.

    Returns:
        JSONResponse: A list of uploaded file details with their statuses.
    """
    temp_folder="uploads"
	# destination_directory="documents"
    if not os.path.exists(temp_folder):
        os.mkdir(temp_folder)
        print("directory created!!")
		# print(list_files)

    connection=sql_connect()
    cursor=connection.cursor()
    cursor.execute("Select file_name from file_metadata")
    uploaded_file_list=[data[0] for data in cursor.fetchall()]
    # print(uploaded_file_list)
    if domain.lower() not in ALLOWED_DOMAINS:
        raise HTTPException(status_code=400, detail=f"Domain '{domain}' is not allowed. Choose from {ALLOWED_DOMAINS}.")

    responses = []
    for file in files:
        file_name=f"{domain}_{file.filename}"
        if file_name not in uploaded_file_list:
            try:
                # Save the file or process it as needed (e.g., save to cloud storage or DB)
                content = await file.read()  # For example purposes, we just read the file.
                # Example: Save to local storage
                with open(f"uploads/{file_name}", "wb") as f:
                    f.write(content)
                
                chunk_ids=[]
                doc_uuid=str(uuid4())
                data_to_insert = (
                doc_uuid,      # id
                file_name,  # file_name
                file.size,  # file_size
                email,    # uploaded_by
                f"{chunk_ids}",       # chunk_ids
                "0",        # token_used
                "0",        # credit_used
                domain,      # category_id
                0             # status
                )
                log_file_metadata(data_to_insert)
                Thread(target=data_ingestion, daemon=True).start() #retrieval
                responses.append(UploadResponse(filename=file.filename, domain=domain, status="Uploaded successfully"))
            except Exception as e:
                responses.append(UploadResponse(filename=file.filename, domain=domain, status=f"Failed: {str(e)}"))
        else:
            responses.append(UploadResponse(filename=file.filename, domain=domain, status="File already exist in the database"))
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"File {file.filename} already exist in the database.")
            
    return responses

@router.get("/domains/", response_model=List[str])
async def get_allowed_domains():
    """Fetch the list of allowed domains."""
    return list(ALLOWED_DOMAINS)

# dependencies=[Depends(JWTBearer())]

@router.post("/chat/")
async def chat(response:RetrievalInput):
    try:
        user_query = response.user_query
        print(f"user query : {user_query}")
        result,chunks = retrieval(user_query)
        final_results={"response":result,"chunks":chunks}
        return JSONResponse(content={"success": True, "data": final_results}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)
    
#  dependencies=[Depends(JWTBearer())]
@router.post("/upload_tabular_data/")
async def upload_tabular_data(
    table_name: str = Form(...),
    email: str = Form(...),
    file: UploadFile = File(...),
):
    # Ensure only CSV and XLSX files are allowed
    if not (file.filename.endswith(".csv") or file.filename.endswith(".xlsx")):
        raise HTTPException(status_code=400, detail="Only CSV and XLSX files are allowed.")
    
    connection = sql_connect()
    cursor = connection.cursor()
    
    try:
        cursor.execute(f"SELECT file_name FROM tabular_metadata where uploaded_by='{email}'")
        uploaded_file_list = {data[0] for data in cursor.fetchall()}
    except Exception as e:
        connection.close()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    
    file_name = file.filename
    
    # Check if file already exists
    if file_name in uploaded_file_list:
        connection.close()
        raise HTTPException(status_code=400, detail=f"File {file_name} already exists in the database.")
    
    try:
        # Read file content
        content = await file.read()
        
        # Load data using pandas
        if file_name.endswith(".csv"):
            df = pd.read_csv(pd.io.common.StringIO(content.decode("ISO-8859-1")))
        else:  # XLSX case
            df = pd.read_excel(content)
        
        # Store data into SQL database
        df.to_sql(table_name, con=connection, if_exists='replace', index=False)
        
        # Log metadata
        doc_uuid=str(uuid4())
        cursor.execute("INSERT INTO tabular_metadata (id, file_name, table_name, uploaded_by) VALUES (?, ?, ?, ?)",
                       (doc_uuid,file_name, table_name, email))
        connection.commit()
    except Exception as e:
        connection.close()
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
    
    connection.close()
    return {"filename": file_name, "status": "Uploaded successfully"}

# dependencies=[Depends(JWTBearer())]

@router.post("/tabular_chat/")
async def tabular_chat(response:TabularAssistantInput):
    try:
        user_query = response.user_query
        table_name = response.table_name
        print(f"user query : {user_query}")
        tabular_agent=TabularAssistant()
        result=tabular_agent.run_query(user_query,table_name)
        return JSONResponse(content={"success": True, "data": result}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)


@router.post("/math_chat/")
async def math_chat(response:MathAssistantInput):
    try:
        user_query = response.user_query
        print(f"user query : {user_query}")
        result=generate_response(user_query)
        return JSONResponse(content={"success": True, "data": result}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)



@router.post("/chatmetadata/")
async def get_matadata(response:ChatMetadataInput):
    try:
        user_email_id = response.email_id
        sql_query=f"select id,file_name,category_id,uploaded_by,status,uploaded_at from file_metadata where uploaded_by='{user_email_id}'"
        connection = sql_connect()
        cursor = connection.cursor()
        cursor.execute(sql_query)
        columns = [desc[0] for desc in cursor.description]  # Extract column names
        data=cursor.fetchall()
        # Convert to list of dictionaries
        records = [dict(zip(columns, row)) for row in data]
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True, "data": records}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)


@router.post("/tabulartmetadata/")
async def get_tabular_matadata(response:ChatMetadataInput):
    try:
        user_email_id = response.email_id
        sql_query=f"select id,file_name,table_name,uploaded_by,uploaded_at from tabular_metadata where uploaded_by='{user_email_id}'"
        connection = sql_connect()
        cursor = connection.cursor()
        cursor.execute(sql_query)
        columns = [desc[0] for desc in cursor.description]  # Extract column names
        data=cursor.fetchall()
        # Convert to list of dictionaries
        records = [dict(zip(columns, row)) for row in data]
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True, "data": records}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)

@router.delete("/get_table_name/")
async def get_table_name(response: ChatMetadataInput):
    try:
        user_email_id = response.email_id
        sql_query=f"select table_name from tabular_metadata where uploaded_by='{user_email_id}'"
        connection = sql_connect()
        cursor = connection.cursor()
        cursor.execute(sql_query)
        # columns = [desc[0] for desc in cursor.description]  # Extract column names
        data=cursor.fetchall()
        # Convert to list of dictionaries
        records = [row.table_name for row in data]
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True, "data": records}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)

@router.delete("/delete_chatmetadata/")
async def delete_metadata(request: DeleteMetadataInput):
    try:
        file_id = request.id

        # Establish database connection
        connection = sql_connect()
        cursor = connection.cursor()

        # Check if the record exists
        cursor.execute("SELECT * FROM file_metadata WHERE id = ?", (file_id,))
        record = cursor.fetchone()

        if not record:
            return JSONResponse(content={"success": False, "message": "Record not found"}, status_code=404)

        # Delete the record
        cursor.execute("DELETE FROM file_metadata WHERE id = ?", (file_id,))
        connection.commit()

        # Close connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True, "message": "Record deleted successfully"}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)


@router.delete("/delete_tabularmetadata/")
async def delete_tabularmetadata(request: DeleteMetadataInput):
    try:
        file_id = request.id

        # Establish database connection
        connection = sql_connect()
        cursor = connection.cursor()

        # Check if the record exists
        cursor.execute("SELECT * FROM tabular_metadata WHERE id = ?", (file_id,))
        record = cursor.fetchone()

        if not record:
            return JSONResponse(content={"success": False, "message": "Record not found"}, status_code=404)

        # Delete the record
        cursor.execute("DELETE FROM file_metadata WHERE id = ?", (file_id,))
        connection.commit()

        # Close connection
        cursor.close()
        connection.close()

        return JSONResponse(content={"success": True, "message": "Record deleted successfully"}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)





#----------------------------------------------------------------------------

from pydantic import BaseModel
from typing import Optional

# Pydantic models
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str

# Define a model for the input JSON
class SummarizerInput(BaseModel):
    query: str

class TextInput(BaseModel):
    query: str

class MemeInput(BaseModel):
    query: str

class ImageInput(BaseModel):
    query: str


class UploadResponse(BaseModel):
    filename: str
    domain: str
    status: str

class RetrievalInput(BaseModel):
    user_query: str

class TabularAssistantInput(BaseModel):
    user_query: str
    table_name:str

class MathAssistantInput(BaseModel):
    user_query: str

class UploadTabularResponse(BaseModel):
    filename: str
    status: str

class ChatMetadataInput(BaseModel):
    email_id:str

class DeleteMetadataInput(BaseModel):
    id: str  # Unique ID of the file to delete
    
    
#--------------------------------------------------------------------------------
from datetime import datetime
import logging
import json
import os
import uuid
import time
from uuid import uuid4
import shutil


# from langchain_elasticsearch import ElasticsearchStore
from werkzeug.utils import secure_filename
import tempfile

from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain.embeddings import SentenceTransformerEmbeddings
from langchain_elasticsearch import ElasticsearchStore
# from langchain_core.documents import Document

from unstructured.partition.pdf import partition_pdf
from services.sql_connection import sql_connect
import sqlite3

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document
from unstructured.partition.docx import partition_docx
from minio import Minio
import pandas as pd
import json
from io import BytesIO
from PIL import Image
import mimetypes
from groq import Groq

# load_dotenv()
# gorq api
# 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


embeddings_client = HuggingFaceEmbeddings(
    model_name ="jinaai/jina-embeddings-v2-base-en", # switch to en/zh for English or Chinese
    # model_kwargs={"max_seq_length":1024}
)

def elastic_search_client():
	elastic_client = ElasticsearchStore(
		es_url="http://4.240.104.16:9200/",
		index_name="metamind",
		embedding=embeddings_client)
	return elastic_client


GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY, max_retries=2)


# Use Groq API for question answering
def groq_qa(question, context):
    """
    Use Groq's Llama model to answer a question based on context.
    """
    messages = [
        {"role": "system", "content": """You are a helpful AI Assistant who generates answer based on user's query. The answer must be generated using the given context.
         If the given user's query out of context, simply say 'The query is out of context! Please ask something related to your work'.
         The generated answer must be concise and to-the-point."""},
        {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
    ]

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.0,
            max_completion_tokens=1024,
            top_p=1,
            stream=True,
            stop=None,
        )

        # Stream and return the response
        response = ""
        for chunk in completion:
            delta = chunk.choices[0].delta.content or ""
            response += delta
            print(delta, end="", flush=True)  # Stream response in real time
        print()  # Print a newline after streaming completes
        return response
    except Exception as e:
        print(f"\nError with Groq API: {e}")
        return "Sorry, I couldn't process your question."

def retrieval(user_query):
	try:
		search_client=elastic_search_client()
		results=search_client.similarity_search_with_score(query=user_query,search_type="mmr",
		k=3)
		context=""
		chunks={}
		for i,chunk in enumerate(results):
			doc, score=chunk[0],chunk[1]
			text=doc.page_content
			print(text)
			chunks[f"chunk_{i}"]=text
			filename=doc.metadata['filename']
			context+=  f"{filename} :: " + text + "\n\n" 
			
		response=groq_qa(user_query,context)
		return response,chunks
	except Exception as e:
		print(f"Error at retrieval ::{e}")

# sql_connect

# item = {
# 						'id': str(file_id),
# 						'file_name': file_name,
# 						'file_size': file_size,
# 						'uploaded_by': email,
# 						'uploaded_at': str(datetime.now()),
# 						'chunk_ids': '',
# 						'token_used': '',
# 						'credit_used': '',
# 						'category_id': category_id,
# 						'ex_time': time.time(),
# 						'status': 0
# 					}

# Reference: https://docs.unstructured.io/open-source/core-functionality/chunking





def document_retrieval_chunking(file_path):
	try:
		if file_path.endswith(".pdf"):
			print("--------------PDF FILE DETECTED-------------")
			chunks = partition_pdf(
				filename=file_path,
				infer_table_structure=True,  # extract tables
				strategy="hi_res",  # mandatory to infer tables
				extract_image_block_types=[
					"Image"
				],  # Add 'Table' to list to extract image of tables
				# image_output_dir_path=output_path,  # if None, images and tables will saved in base64
				extract_image_block_to_payload=True,  # if true, will extract base64 for API usage
				chunking_strategy="by_title",  # or 'basic', by_page - api
				max_characters=10000,  # defaults to 500
				combine_text_under_n_chars=2000,  # defaults to 0
				new_after_n_chars=6000,
				# extract_images_in_pdf=True,          # deprecated
			)
			print(chunks)
			return chunks
		elif file_path.endswith(".docx"):
			print("--------------DOCX FILE DETECTED-------------")
			chunks = partition_docx(filename=file_path,
                        strategy="hi_res",
                        infer_table_structure=True, 
                        include_page_breaks=True,
                        extract_image_block_types=["Image"], 
                        extract_image_block_to_payload=True,
                        chunking_strategy="by_title",
                        max_characters=10000,
                        combine_text_under_n_chars=2000,  # defaults to 0
                        new_after_n_chars=6000)
			print(chunks)
			return chunks
	except Exception as e:
		print("partition error ::",e)


search_client=elastic_search_client()


def chunk_processing(chunks,file_name,domain):
	list1=[]
	chunk_ids=[]
	for id, chunk in enumerate(chunks):
		chunk_dict = chunk.to_dict()
		elements = chunk.metadata.orig_elements
		chunk_images = [el.to_dict() for el in elements if "Image" in str(type(el))]
		# Preparing the Chunk 
		item = {}

		if "metadata" not in item.keys():
			item['metadata']={}

		# Check the table is in the chunk, is yes add into the text context
		if "Table" in str(elements):
			item["page_content"] = (
				chunk_dict["text"]
				+ "Table in Html format :"
				+ chunk_dict["metadata"]["text_as_html"]
			)
		else:
			item["page_content"] = chunk_dict["text"]

		# Assigning the chunk ids to document chunk
		item["metadata"]["chunk_id"] = file_name + f"_{id}"
		chunk_ids.append(item["metadata"]["chunk_id"])
		# File Metadata
		item["metadata"]["filename"] = chunk_dict["metadata"]["filename"]
		item["metadata"]["element_id"] = chunk_dict["element_id"]
		item["metadata"]['domain']=domain
			
		if "page_number" in chunk_dict["metadata"].keys():
			item["metadata"]["page_number"] = str(chunk_dict["metadata"]["page_number"])
		else:
			item["metadata"]["page_number"] = "NA"
		
		if chunk_images:
			item["metadata"]["images_info"] = str(
				[
					{
						"image_associated_text": i["text"],
						"image_base64": i["metadata"]["image_base64"],
						"images_link": "",
					}
					for i in chunk_images
				]
			)
		# item["chunk_vector"] = generate_embeddings_openai(item["chunk"], client)
		list1.append(item)
	document_list=[Document(page_content=doc['page_content'],metadata=doc['metadata']) for doc in list1]
	return document_list,chunk_ids

def log_file_metadata(data):
	try:
		conn=sql_connect()
		cursor=conn.cursor()
		sql="""INSERT INTO file_metadata (id,file_name,file_size,uploaded_by,chunk_ids,token_used,credit_used,category_id,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"""
		cursor.execute(sql,data)
		conn.commit()
		print("Data inserted successfully.")
	except sqlite3.IntegrityError as e:
		print(f"Error inserting data: {e}")
	finally:
		conn.close()

def update_file_metadata(file_name, chunk_ids, status):
    try:
        conn = sql_connect()
        cursor = conn.cursor()
        sql = """UPDATE file_metadata 
                 SET chunk_ids = ?, status = ? 
                 WHERE file_name = ?;"""
        cursor.execute(sql, (chunk_ids, status, file_name))
        conn.commit()
        
        if cursor.rowcount > 0:
            print("Data updated successfully.")
        else:
            print("No record found with the specified file name.")
    except sqlite3.IntegrityError as e:
        print(f"Error updating data: {e}")
    finally:
        conn.close()

def get_details(file_name):
	try:
		conn = sql_connect()
		cursor = conn.cursor()
		sql=f"""select * from file_metadata where file_name='{file_name}'"""
		cursor.execute(sql)
		details_list=cursor.fetchall()
		print(details_list)
		details={"file_name":details_list[0][1],"domain":details_list[0][7]}
		return details
	except sqlite3.IntegrityError as e:
		print(f"Error updating data: {e}")
	finally:
		conn.close()

# Initialize MinIO client
minio_client = Minio(
    "4.240.104.16:9000",  # MinIO server hosted at your URL
    access_key="qjaIb6kmOspGolVOTmYC",
    secret_key="xNb2BC5NJlwc42HYjGyQLMyvfoSnQi7qNXAPtlKE",
    secure=False  # Change to True if using HTTPS
)


def upload_file(bucket_name, object_name, file_path):
    try:
        content_type, _ = mimetypes.guess_type(file_path)
        if content_type is None:
            content_type = "application/octet-stream"  # Default content type for unknown files
        
        minio_client.fput_object(bucket_name, object_name, file_path, content_type=content_type)
        print(f"File {object_name} uploaded successfully to {bucket_name} with content type {content_type}")
    except Exception as e:
        print(f"Error uploading file {object_name} to {bucket_name}: {e}")
        raise  # Re-raise the caught exception


def data_ingestion():
	temp_folder="uploads"
	destination_directory="documents"
	if os.path.exists(temp_folder):
		list_files=os.listdir(temp_folder)
		print("No. of Files Detected ::",len(list_files))
		# print(list_files)

	for file_name in list_files:
		try:
			print(file_name)
			data_dict=get_details(file_name)
			file_path=os.path.join(temp_folder , file_name)
			chunks=document_retrieval_chunking(file_path) # document_list,chunk_ids
			document_list,chunk_ids=chunk_processing(chunks,file_name,data_dict['domain'])
			uuids = [str(uuid4()) for _ in range(len(document_list))]
			## Add File Vectors to the elastic search
			search_client.add_documents(documents=document_list, ids=uuids)
			status=1
			# Data to update
			update_file_metadata(file_name,f"{chunk_ids}",status)
			source_path = os.path.join(temp_folder, file_name)
			# destination_path = os.path.join(destination_directory, file_name)
			# shutil.move(source_path, destination_path)
			upload_file(destination_directory, file_name, source_path)
			# Ensure it's a file, not a subfolder
			if os.path.isfile(source_path):  
				os.remove(source_path)
			print(f'Moved: {file_name}')
			print("Document Chunking, Indexing and Uploaded to Elastic Search Succesfully")
		except:
			print(f'Failed to Moved: {file_name}')
			print("Document Chunking, Indexing and Uploaded to Elastic Search Failed")



# if __name__ == "__main__":
	# document_retrieval(r"D:\30. Open Source llm -RAG\Knowledge-Hub-Assistant\backend\document")
	# chunks=document_retrieval(r"D:\30. Open Source llm -RAG\Knowledge-Hub-Assistant\backend\document")