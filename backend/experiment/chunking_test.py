import os
import shutil
import streamlit as st
from unstructured.partition.pdf import partition_pdf
from langchain_core.documents import Document
from elasticsearch import Elasticsearch
from transformers import AutoModel
from groq import Groq

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["TOKENIZERS_PARALLELISM"] = "FALSE" 

embeddings_client = AutoModel.from_pretrained("jinaai/jina-embeddings-v3", trust_remote_code=True)

# Directory to store uploaded files temporarily
UPLOADS_FOLDER = "uploads_chunking"
os.makedirs(UPLOADS_FOLDER, exist_ok=True)

# Function to save the uploaded file to the server
def save_uploaded_file(uploaded_file):
    file_path = os.path.join(UPLOADS_FOLDER, uploaded_file.name)
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getvalue())
    return file_path

# Function to chunk documents (PDF or DOCX) into smaller sections for indexing
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
			#print(chunks)
			return chunks
	except Exception as e:
		print("partition error ::",e)


# Function to process chunks and prepare them as documents for indexing
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

# Function to clear the folder where uploaded files are stored
def clear_uploads_folder(folder_path=UPLOADS_FOLDER):
    try:
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)  # Remove the folder and its contents
            os.makedirs(folder_path, exist_ok=True)  # Recreate an empty folder
    except Exception as e:
        st.error(f"Error clearing uploads folder: {e}")

# Elasticsearch index name for storing document embeddings and metadata
INDEX_NAME = "chatbot_chunking"

es = Elasticsearch(
    "https://my-elasticsearch-project-cfe0e1.es.us-east-1.aws.elastic.cloud:443",
    api_key="UkRENnRKVUJPZVdObzhRY2Y1ckg6eEVUWXFHTnNxNlpnMHFXQ2lPN2F6QQ=="
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

# Ensure the index is created at the start of the application
create_index()

# Function to check if a document is already indexed in Elasticsearch
def is_document_indexed(file_name):
    query = {"query": {"match": {"metadata.filename": file_name}}}
    response = es.search(index=INDEX_NAME, body=query)
    return response['hits']['total']['value'] > 0

# Function to index documents with their embeddings into Elasticsearch
def index_documents_to_es(documents):
    for doc in documents:
        embedding_vector = embeddings_client.encode(doc.page_content, truncate_dim=768, task='retrieval.passage')  # Generate embedding for the document content
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
        st.error(f"Error retrieving items from index: {e}")
        return []

# Function to perform a k-NN search in Elasticsearch based on a query
def query_index(query):
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

# Function to delete the Elasticsearch index and remove all uploaded files
def delete_index(index_name=INDEX_NAME):
    try:
        if es.indices.exists(index=index_name):
            es.indices.delete(index=index_name)  # Delete the index from Elasticsearch
            st.success("Index deleted successfully.")
        else:
            st.warning("Index does not exist.")
        
        clear_uploads_folder()  # Remove all uploaded files from the server
        st.success("Uploaded files removed, and uploads folder cleared.")
    except Exception as e:
        st.error(f"Error deleting index: {e}")

GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY, max_retries=2)

# Use Groq API for question answering
def groq_qa(question, context, response_lang):
    """
    Use Groq's Llama model to answer a question based on context.
    """
    messages = [
        {"role": "system", "content": f"""You are a helpful AI Assistant who generates answers based on the given context.
			1. If the user's query is out of context, simply respond: "The query is out of context! Please ask something related to your work.
			2. The answer must be concise and to the point.
			3. The context and user query is available in either English or Arabic or both, but the final answer should be in the {response_lang} language specified by the user."""},
        {"role": "user", "content": f"Context: {context}\n\nQuestion: {question}"}
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
			#print(doc)
			text=doc['page_content']
			# print(text)
			chunks[f"chunk_{i}"]=text + f"\n\n- {similarity_distance}"
			filename=doc["metadata"]['filename']
			context+=  f"{filename} :: " + text + "\n\n" 
			
		response=groq_qa(user_query,context, response_lang)
		return response,chunks
	except Exception as e:
		print(f"Error at retrieval ::{e}")

# Streamlit app to interact with the document indexing and search system
def app():
    st.title("Document Chunking")

    # File upload section
    uploaded_files = st.file_uploader("Upload PDF/DOCX files", accept_multiple_files=True)
    
    if uploaded_files:
        for uploaded_file in uploaded_files:
            # Check if the file is already indexed in Elasticsearch
            if is_document_indexed(uploaded_file.name):
                st.write(f"{uploaded_file.name} is already indexed. Skipping.")
                continue 

            # Save and process the new file if it is not indexed
            file_path = save_uploaded_file(uploaded_file)
            chunks = document_retrieval_chunking(file_path)
            if chunks:
                document_list, chunk_ids = chunk_processing(chunks, uploaded_file.name)  # Process the chunks into documents
                index_documents_to_es(document_list)
                st.write(f"{uploaded_file.name} uploaded, chunked, and indexed.")

    # Delete index button (allows the user to delete the Elasticsearch index and clear uploaded files)
    st.header("Manage Index")
    if st.button("Delete Index"):
        delete_index()
        
    # Display all indexed documents
    st.header("All Indexed Documents")
    documents = get_all_items_from_index()
    if documents:
        for doc in documents:
            st.subheader(f"{doc['metadata']['filename']} (Chunk ID: {doc['metadata']['chunk_id']})")
            st.write(f"Page Number: {doc['metadata']['page_number']}")
            st.write(f"Content: {doc['page_content']}")  # Show a snippet of the content
            st.write("---")
    else:
        st.write("No documents found in the index.")

    # Search functionality
    st.header("Search the Index")
    user_query = st.text_input("Enter a search query:")
    if user_query:
        st.subheader("Search Results")
        answer, chunks = retrieval(user_query, 'eng')  # Perform the search using the user's query
        if answer:
            st.write(answer)
            st.write(chunks)
        else:
            st.write("No results found.")
    

if __name__ == "__main__":
    app()
