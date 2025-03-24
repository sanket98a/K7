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
from elasticsearch import Elasticsearch
from transformers import AutoModel
# load_dotenv()
# gorq api
# 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

embeddings_client = AutoModel.from_pretrained("jinaai/jina-embeddings-v3", trust_remote_code=True)
# embeddings_client = HuggingFaceEmbeddings(
#     model_name ="jinaai/jina-embeddings-v2-base-en", # switch to en/zh for English or Chinese
#     # model_kwargs={"max_seq_length":1024}
# )

# def elastic_search_client():
# 	elastic_client = ElasticsearchStore(
# 		es_url="http://4.240.104.16:9200/",
# 		index_name="metamind",
# 		embedding=embeddings_client)
# 	return elastic_client


GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY, max_retries=2)

INDEX_NAME="metamind_v2"
# Initialize Elasticsearch client using API key for authentication. This connects to the Elasticsearch service.
es = Elasticsearch(
    "http://4.240.104.16:9200/",
    # api_key="cy1PV2NwVUIwRnN2ZmJmSnBYOEM6SVBlSjhZRFpTNVd1bTFzbXR3NldJQQ=="
)





# Function to create the Elasticsearch index with kNN settings for similarity search
def create_index():
    if not es.indices.exists(index=INDEX_NAME):
        es.indices.create(index=INDEX_NAME, body={
            "mappings": {
                "properties": {
                    "embedding": {"type": "dense_vector", "dims": 768, "index": True, "similarity": "l2_norm"},
                    "page_content": {"type": "text"},
		    		"ar_page_content": {"type": "text", "analyzer": "arabic"},
                    "metadata": {
                        "properties": {
                            "chunk_id": {"type": "keyword"},
                            "filename": {"type": "keyword"},
                            "page_number": {"type": "keyword"}
                        }
                    }
                }
            }
        })


# Function to index documents with their embeddings into Elasticsearch
def index_documents_to_es(documents):
    for doc in documents:
		embedding_vector = embeddings_client.encode(doc.page_content, truncate_dim=768, task='retrieval.passage')    
        #embedding_vector = embeddings_client.embed_query(doc.page_content)  # Generate embedding for the document content
        es.index(index=INDEX_NAME, body={
            "embedding": embedding_vector,
            "page_content": doc.page_content,
			"ar_page_content": doc.page_content,
            "metadata": doc.metadata
        })

# Function to retrieve all indexed documents from Elasticsearch
def get_all_items_from_index(size=100):
    try:
        response = es.search(index=INDEX_NAME, body={"query": {"match_all": {}}, "size": size})
        return [hit['_source'] for hit in response['hits']['hits']]  # Extract document data
    except Exception as e:
        print(f"Error retrieving items from index: {e}")
        return []


# Function to perform a k-NN search in Elasticsearch based on a query
def query_index(query, size=5):
    query_embedding = embeddings_client.encode(query, truncate_dim=768, task='retrieval.query')  # Convert query to embedding

    # Perform k-NN search using Elasticsearch's kNN feature
    response = es.search(
        index=INDEX_NAME,
        query={
            "bool": {
                "must": [
                    {
                        "match_phrase": {
                            "ar_page_content": {
                                "query": query,
                                "analyzer": "arabic",
                                
                            }
                        }
                    },
                    {
                        "match": {
                            "page_content": {
                                "query": query,
                                
                            }
                        }
                    }
                ],
                "boost": 1.0
            }
        },
        knn= {
                    "field": "embedding",  # The field to search in (embedding vector)
                    "query_vector": query_embedding.tolist(),  # Query embedding converted to a list
                    "k": 5,  # Number of nearest neighbors to retrieve
                    "num_candidates": 100,  # Number of candidates to consider in the search
                    "boost": 1.5,
        },
        size=5
    )
    return response['hits']['hits']

# Use Groq API for question answering
def groq_qa(question, context, response_lang):
    """
    Use Groq's Llama model to answer a question based on context.
    """
    messages = [
    {
        "role": "system",
        "content": f"""You are a helpful and conversational AI Assistant specializing in government policies and laws related to electricity, gas, and data. 
        Your task is to generate answers strictly based on the given context chunks along with the citation in the format [Filename:filename Page:page_num]. 
        1. If the user's query is out of context, respond with: "The query is out of context! Please ask something related to the uploaded documents."
        2. Provide clear, concise, **SHORT**, and conversational answers, while maintaining accuracy based on the context.
        3. If the context does not contain enough information to answer the query, respond with: 
        "The context does not contain enough information to fully answer your query. Let me know if you need further clarification or have a related question."
        4. The context and user query may be in either English, Arabic, or both, but the final answer should be in the {response_lang} language specified by the user.
        5. Maintain a friendly and conversational tone, making the interaction feel natural and engaging.
        6. Always include the citation in the format [Filename:filename Page:page_num] **right after the relevant portion of the answer**.
        
        ### Few-shot examples:

        **Example 1:**  
        **User:** What is the definition of "electricity activity"?  
        **Context:**  
        "Electricity activity: Any activity performed or intended to be performed in the electricity sector. It includes generating electricity, combined production from any energy source, transmitting, distributing, trading, and retail selling of electricity, as well as the activities of the principal buyer and district cooling."  
        **Answer:**  
        Electricity activity refers to any work related to generating, transmitting, distributing, trading, or retail selling of electricity, including district cooling and the principal buyer's activities. [Filename: Electricity Law, Page: 1]

        **Example 2:**  
        **User:** What is the difference between "main distribution station" and "secondary distribution"?  
        **Context:**  
        "Main distribution station: The station that converts medium voltage to another medium voltage.  
        Secondary distribution: The station that converts medium voltage to low voltage."  
        **Answer:**  
        The main distribution station converts medium voltage to another medium voltage. [Filename: Electricity Law, Page: 1]  
        The secondary distribution station reduces medium voltage to low voltage. [Filename: Electricity Law, Page: 2]
        """
    },
    {
        "role": "user",
        "content": f"Context chunks: {context}\n\nQuestion: {question}"
    }
    ]

    try:
        completion = client.chat.completions.create(
            model="llama-3.2-90b-vision-preview",
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

def retrieval(user_query, response_lang):
	try:
		# search_client=elastic_search_client()
		# results=search_client.similarity_search_with_score(query=user_query,search_type="mmr",
		# k=3)
		results=query_index(user_query)
		context=""
		chunks={}
		for i,result in enumerate(results):
			# doc, score=chunk[0],chunk[1]
			doc=result['_source']
			similarity_distance=(result["_score"])
			print(doc)
			text=doc['page_content']
			# print(text)
			filename = doc["metadata"]['filename']
            page_num = doc["metadata"]["page_number"]
            chunks[f"Filename: {filename} (Page: {page_num})"] = text + f"\n\n- {similarity_distance}"
			#chunks[f"chunk_{i}"]=text + f"\n\n- {similarity_distance}"
			#filename=doc["metadata"]['filename']
			context += f"Filename: {filename} (Page: {page_num}) :: {text}\n\n"
			#context+=  f"{filename} :: " + text + "\n\n" 
			
		response=groq_qa(user_query,context, response_lang)
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
				strategy="ocr_only",  # mandatory to infer tables
				extract_image_block_types=[
					"Image"
				],  # Add 'Table' to list to extract image of tables
				languages = ['ara','eng'],
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


# search_client=elastic_search_client()


def chunk_processing(chunks, file_name):
    list1 = []
    chunk_ids = []
    for id, chunk in enumerate(chunks):
        chunk_dict = chunk.to_dict()
        elements = chunk.metadata.orig_elements
        chunk_images = [el.to_dict() for el in elements if "Image" in str(type(el))]
        # Preparing the Chunk 
        item = {}

        if "metadata" not in item.keys():
            item['metadata'] = {}

        # Check the table is in the chunk, if yes add into the text context
        if "Table" in str(elements):
            item["page_content"] = (
                chunk_dict["text"]
                + "Table in Html format :"
                + chunk_dict["metadata"]["text_as_html"]
            )
        else:
            item["page_content"] = chunk_dict['text']


        # Assigning the chunk ids to document chunk
        item["metadata"]["chunk_id"] = file_name + f"_{id}"
        chunk_ids.append(item["metadata"]["chunk_id"])
        # File Metadata
        item["metadata"]["filename"] = chunk_dict["metadata"]["filename"]
        item["metadata"]["element_id"] = chunk_dict["element_id"]
            
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
    document_list = [Document(page_content=doc['page_content'], metadata=doc['metadata']) for doc in list1]
    return document_list, chunk_ids


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
    access_key="YUsyolLth5wNTRWBjOgM",
    secret_key="Q0H1b3D83HXHRztsDbFlOaHIPu1UgdrEHNGWjDjk",
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
			# uuids = [str(uuid4()) for _ in range(len(document_list))]
			## Add File Vectors to the elastic search
			# search_client.add_documents(documents=document_list, ids=uuids)
			index_documents_to_es(document_list)  # Index the documents into Elasticsearch
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
		except Exception as e:
			print("Error ::",e)
			print(f'Failed to Moved: {file_name}')
			print("Document Chunking, Indexing and Uploaded to Elastic Search Failed")



# if __name__ == "__main__":
	# document_retrieval(r"D:\30. Open Source llm -RAG\Knowledge-Hub-Assistant\backend\document")
	# chunks=document_retrieval(r"D:\30. Open Source llm -RAG\Knowledge-Hub-Assistant\backend\document")
