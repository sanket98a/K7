import datetime
import os
import bcrypt
from fastapi import HTTPException, status
from dotenv import load_dotenv
from jose import JWTError, jwt
# import jwt

load_dotenv()

# In-memory database (replace with a real database)
fake_users_db = {}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=int(os.getenv('JWT_TOKEN_EXPIRE_MINUTES')))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv('JWT_SECRET_KEY'), algorithm=os.getenv('JWT_TOKEN_ALGORITHM'))
    return encoded_jwt

def verify_access_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), 
                                algorithms=[os.getenv('JWT_TOKEN_ALGORITHM')])
        exp_timestamp = payload.get('exp')
        if exp_timestamp is None:
            raise credentials_exception

        exp_time = datetime.datetime.fromtimestamp(exp_timestamp, datetime.timezone.utc)
        curr_time = datetime.datetime.now(datetime.timezone.utc)
        if curr_time > exp_time:
            raise credentials_exception
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = {"email": email, "role": payload.get("role")}
    except JWTError as e:
        print("JWT Error Occurred:", e)
        raise credentials_exception
    except Exception as e:
        print("Unexpected Error occurred in Verify_access_token: ", e)
        raise credentials_exception
    return token_data

def encrypt_password(password: str) -> str:
    """decode the passwords."""
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    return hashed_password.decode()

def verify_password(plainPassword:str, storedPassword:str) -> bool:
     """Verify a password against its hash."""
     return bcrypt.checkpw(plainPassword.encode('utf-8'), storedPassword.encode('utf-8'))





# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """Verify a password against its hash."""
#     return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))