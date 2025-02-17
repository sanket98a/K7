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
import bcrypt
import json
from threading import Thread
from services.documentService import data_ingestion, retrieval
from minio import Minio
import pandas as pd
import json
from io import BytesIO
from PIL import Image
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



@router.post("/upload/", response_model=List[UploadResponse],dependencies=[Depends(JWTBearer())])
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

    return responses

@router.get("/domains/", response_model=List[str])
def get_allowed_domains():
    """Fetch the list of allowed domains."""
    return list(ALLOWED_DOMAINS)

@router.post("/chat/",dependencies=[Depends(JWTBearer())])
def chat(response:RetrievalInput):
    try:
        user_query = response.user_query
        print(f"user query : {user_query}")
        result = retrieval(user_query)
        return JSONResponse(content={"success": True, "data": result}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)