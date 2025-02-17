
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
    
    
