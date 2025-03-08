import os
import shutil
import streamlit as st
from unstructured.partition.docx import partition_docx
from unstructured.partition.pdf import partition_pdf
from elasticsearch import Elasticsearch
from langchain_core.documents import Document
import nltk

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

# Initialize Elasticsearch client
es = Elasticsearch(
    "https://b2cf8590fceb41c3800524f8098b357d.us-east4.gcp.elastic-cloud.com:443",
    api_key="cy1PV2NwVUIwRnN2ZmJmSnBYOEM6SVBlSjhZRFpTNVd1bTFzbXR3NldJQQ=="
)

# Folder to store uploaded files
UPLOADS_FOLDER = "uploads"
os.makedirs(UPLOADS_FOLDER, exist_ok=True)

# Elasticsearch index name
INDEX_NAME = "chatbot"

# Function to create the index if it doesn't exist
def create_index(index_name=INDEX_NAME):
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body={
            "mappings": {
                "properties": {
                    "page_content": {"type": "text"},
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

# Ensure index is created at the start
create_index()

# Function to save uploaded files
def save_uploaded_file(uploaded_file):
    file_path = os.path.join(UPLOADS_FOLDER, uploaded_file.name)
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getvalue())
    return file_path

# Function to check if a document is already indexed
def is_document_indexed(file_name, index_name=INDEX_NAME):
    query = {"query": {"match": {"metadata.filename": file_name}}}
    response = es.search(index=index_name, body=query)
    return response['hits']['total']['value'] > 0

# Function to chunk documents
def document_retrieval_chunking(file_path):
    try:
        if file_path.endswith(".pdf"):
            return partition_pdf(
                filename=file_path,
                infer_table_structure=True,
                strategy="hi_res",
                extract_image_block_types=["Image"],
                chunking_strategy="by_title",
                max_characters=10000,
                combine_text_under_n_chars=2000,
                new_after_n_chars=6000
            )
        elif file_path.endswith(".docx"):
            return partition_docx(
                filename=file_path,
                strategy="hi_res",
                infer_table_structure=True,
                include_page_breaks=True,
                extract_image_block_types=["Image"],
                extract_image_block_to_payload=True,
                chunking_strategy="by_title",
                max_characters=10000,
                combine_text_under_n_chars=2000,
                new_after_n_chars=6000
            )
    except Exception as e:
        st.error(f"Error during chunking: {e}")
        return []

# Function to process chunks and prepare them for indexing
def chunk_processing(chunks, file_name):
    document_list = []
    for id, chunk in enumerate(chunks):
        chunk_dict = chunk.to_dict()
        document_list.append(
            Document(
                page_content=chunk_dict['text'],
                metadata={
                    'chunk_id': f"{file_name}_{id}",
                    'filename': chunk_dict['metadata']['filename'],
                    'page_number': str(chunk_dict['metadata'].get('page_number', 'NA'))
                }
            )
        )
    return document_list

# Function to index documents in Elasticsearch
def index_documents_to_es(documents, index_name=INDEX_NAME):
    for doc in documents:
        es.index(index=index_name, body={
            "page_content": doc.page_content,
            "metadata": doc.metadata
        })

# Function to retrieve all indexed documents
def get_all_items_from_index(index_name=INDEX_NAME, size=100):
    try:
        response = es.search(index=index_name, body={"query": {"match_all": {}}, "size": size})
        return [hit['_source'] for hit in response['hits']['hits']]
    except Exception as e:
        st.error(f"Error retrieving items from index: {e}")
        return []

# Function to search the index
def query_index(query, index_name=INDEX_NAME, size=5):
    try:
        response = es.search(index=index_name, body={
            "query": {"match": {"page_content": query}},
            "size": size
        })
        return response['hits']['hits']
    except Exception as e:
        st.error(f"Error querying the index: {e}")
        return []

# Function to clear all uploaded files
def clear_uploads_folder(folder_path=UPLOADS_FOLDER):
    try:
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)  # Remove the folder and its contents
            os.makedirs(folder_path, exist_ok=True)  # Recreate an empty folder
    except Exception as e:
        st.error(f"Error clearing uploads folder: {e}")

# Function to delete the entire index and remove uploaded files
def delete_index(index_name=INDEX_NAME):
    try:
        if es.indices.exists(index=index_name):
            es.indices.delete(index=index_name)  # Directly delete the index
            st.success("Index deleted successfully.")
        else:
            st.warning("Index does not exist.")
        
        clear_uploads_folder()  # Remove uploaded files
        st.success("Uploaded files removed, and uploads folder cleared.")
    except Exception as e:
        st.error(f"Error deleting index: {e}")

# Streamlit app
def app():
    st.title("Document Indexing and Search")

    # File upload section
    uploaded_files = st.file_uploader("Upload PDF/DOCX files", accept_multiple_files=True)
    new_files_uploaded = False  # Track if new files are uploaded
    
    if uploaded_files:
        for uploaded_file in uploaded_files:
            if is_document_indexed(uploaded_file.name):
                st.write(f"{uploaded_file.name} is already indexed. Skipping.")
                continue  

            # Save and process new file
            file_path = save_uploaded_file(uploaded_file)
            chunks = document_retrieval_chunking(file_path)
            if chunks:
                document_list = chunk_processing(chunks, uploaded_file.name)
                index_documents_to_es(document_list)
                st.write(f"{uploaded_file.name} uploaded, chunked, and indexed.")
                


    # Display all indexed documents
    st.header("All Indexed Documents")
    documents = get_all_items_from_index()
    if documents:
        for doc in documents:
            st.subheader(f"{doc['metadata']['filename']} (Chunk ID: {doc['metadata']['chunk_id']})")
            st.write(f"Page Number: {doc['metadata']['page_number']}")
            st.write(f"Content: {doc['page_content'][:1000]}...")  # Show snippet
            st.write("---")
    else:
        st.write("No documents found in the index.")

    # Delete index button
    st.header("Manage Index")
    if st.button("Delete Index"):
        delete_index()

    # Search functionality
    st.header("Search the Index")
    user_query = st.text_input("Enter a search query:")
    if user_query:
        st.subheader("Search Results")
        search_results = query_index(user_query)
        if search_results:
            for result in search_results:
                doc = result['_source']
                st.write(f"{doc['metadata']['filename']} (Chunk ID: {doc['metadata']['chunk_id']})")
                st.write(f"Page Number: {doc['metadata']['page_number']}")
                st.write(results["_score"])
                st.write("---")
        else:
            st.write("No results found.")

if __name__ == "__main__":
    app()
