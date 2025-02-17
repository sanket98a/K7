
from utility.auth_helper import create_access_token, encrypt_password, verify_password
from utility.auth_bearer import JWTBearer
from services.sql_connection import sql_connect
from model import *

from fastapi import FastAPI, Depends, HTTPException, status,APIRouter
from fastapi.responses import JSONResponse
from typing import Optional
import logging
import bcrypt



router = APIRouter(tags=['Authentication'])

logging.basicConfig(level=logging.INFO,format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(login_request: LoginRequest):
    """User login"""
    connection = sql_connect()
    cursor = connection.cursor()
    try:
        # Query to check if the user exists
        query = """
        SELECT name, email, password ,created_at
        FROM users 
        WHERE lower(email) = ?
        """
        # Execute the query with the parameterized email
        cursor.execute(query, (login_request.email.lower(),))
        user = cursor.fetchone()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.")
        # Validate the password
        stored_password = user[2]  # Assuming password is stored in the 3th column
        if not verify_password(login_request.password, stored_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.")

        # Generate a JWT token (Assume you have a function `generate_jwt_token`)
        jwtdata = {
            "email": login_request.email,
            "role": "user"
        }
        jwt_token = create_access_token(jwtdata)

        return {
            "message": "User signed in successfully",
            "access_token": jwt_token,
            "user": {
                "name": user[0],
                "email": user[1]}}

    except HTTPException as e:
        logger.error(f"login in- Error: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.")
    finally:
        cursor.close()
        connection.close()