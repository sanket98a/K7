from fastapi import APIRouter, Depends
from services.sql_connection import sql_connect

router = APIRouter(prefix='/setup', tags=['Setup'])


async def create_service():
        print("-----Initalizing Setup-----------")
        conn=sql_connect()
        cursor=conn.cursor()
        # Create user table
        # Define the table schema (modify as needed)
        create_table_query = """CREATE TABLE IF NOT EXISTS users (
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"""
        try:
           cursor.execute(create_table_query)
           print("1. users Table available")
        except Exception as e:
           print(f"An error occurred in user table Creation: {e}")

        # Define the table schema (modify as needed)
        create_table_query = """CREATE TABLE IF NOT EXISTS file_metadata (
        id TEXT NOT NULL,
        file_name TEXT UNIQUE NOT NULL,
        file_size TEXT NOT NULL,
        uploaded_by TEXT,
        chunk_ids TEXT NOT NULL,
        token_used TEXT,
        credit_used TEXT,
        category_id TEXT NOT NULL,
        status INT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"""

        try:
           cursor.execute(create_table_query)
           print("2. file metadata Table available")
        except Exception as e:
           print(f"An error occurred in user table Creation: {e}")

         # Define the table schema (modify as needed)
        create_table_query = """
        CREATE TABLE IF NOT EXISTS tabular_metadata (
            id SERIAL PRIMARY KEY,
            file_name VARCHAR(255) UNIQUE NOT NULL,
            table_name STRING NOT NULL,
            uploaded_by VARCHAR(255) NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )"""

        try:
           cursor.execute(create_table_query)
           print("2. Tabular metadata Table available")
        except Exception as e:
            print(f"An error occurred in user table Creation: {e}")

        