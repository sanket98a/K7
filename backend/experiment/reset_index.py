import csv
from elasticsearch import Elasticsearch

INDEX_NAME = "metamind_v2"

# Initialize Elasticsearch client
es = Elasticsearch("http://4.240.104.16:9200/")

# Function to retrieve all indexed documents from Elasticsearch
def get_all_items_from_index(size=1000):
    try:
        response = es.search(index=INDEX_NAME, body={"query": {"match_all": {}}, "size": size})
        return [hit['_source'] for hit in response['hits']['hits']]
    except Exception as e:
        print(f"Error retrieving items from index: {e}")
        return []

def save_to_csv(documents, filename="output.csv"):
    if not documents:
        print("No documents found in the index.")
        return
    
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["Filename", "Chunk ID", "Page Number", "Content"])
        
        for doc in documents:
            writer.writerow([
                doc['metadata']['filename'],
                doc['metadata']['chunk_id'],
                doc['metadata']['page_number'],
                doc['page_content']
            ])
    
    print(f"Data successfully saved to {filename}")

def delete_docs_from_index():
    try:
        response = es.delete_by_query(index=INDEX_NAME, body={"query": {"match_all": {}}})
        return response
    except Exception as e:
        print(f"Error retrieving items from index: {e}")
        return []


documents = get_all_items_from_index()
#save_to_csv(documents)
##response = delete_docs_from_index()
#documents = get_all_items_from_index()
save_to_csv(documents, "output_4.csv")#