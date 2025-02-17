import pytest
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch
from utility.auth_helper import create_access_token, encrypt_password, verify_password # Replace with actual import paths

client = TestClient(app)

@pytest.fixture
def mock_user_data():
    return {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "hashed_password",
        "created_at": "2024-12-15",
    }

@patch("app.routers.sql_connect")  # Mock the database connection
@patch("app.dependencies.verify_password")  # Mock the password verification function
@patch("app.dependencies.create_access_token")  # Mock the JWT token generation function
def test_login_success(mock_create_access_token, mock_verify_password, mock_sql_connect, mock_user_data):
    # Mock the database connection and cursor
    mock_connection = mock_sql_connect.return_value
    mock_cursor = mock_connection.cursor.return_value
    mock_cursor.fetchone.return_value = (
        mock_user_data["name"],
        mock_user_data["email"],
        mock_user_data["password"],
        mock_user_data["created_at"],
    )

    # Mock password verification and JWT generation
    mock_verify_password.return_value = True
    mock_create_access_token.return_value = "mock_jwt_token"

    # Input for the login endpoint
    login_request = {
        "email": mock_user_data["email"],
        "password": "valid_password",
    }

    # Call the endpoint
    response = client.post("/login", json=login_request)

    # Assertions
    assert response.status_code == 200
    assert response.json() == {
        "message": "User signed in successfully",
        "access_token": "mock_jwt_token",
        "user": {
            "name": mock_user_data["name"],
            "email": mock_user_data["email"],
        },
    }


def test_login_invalid_email(mock_sql_connect):
    # Mock the database connection and cursor
    mock_connection = mock_sql_connect.return_value
    mock_cursor = mock_connection.cursor.return_value
    mock_cursor.fetchone.return_value = None  # No user found for the email

    # Input for the login endpoint
    login_request = {
        "email": "invalid@example.com",
        "password": "some_password",
    }

    # Call the endpoint
    response = client.post("/login", json=login_request)

    # Assertions
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password."}


def test_login_invalid_password(mock_sql_connect, mock_verify_password, mock_user_data):
    # Mock the database connection and cursor
    mock_connection = mock_sql_connect.return_value
    mock_cursor = mock_connection.cursor.return_value
    mock_cursor.fetchone.return_value = (
        mock_user_data["name"],
        mock_user_data["email"],
        mock_user_data["password"],
        mock_user_data["created_at"],
    )

    # Mock password verification
    mock_verify_password.return_value = False  # Invalid password

    # Input for the login endpoint
    login_request = {
        "email": mock_user_data["email"],
        "password": "invalid_password",
    }

    # Call the endpoint
    response = client.post("/login", json=login_request)

    # Assertions
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid email or password."}


def test_login_unexpected_error(mock_sql_connect):
    # Mock the database connection to raise an exception
    mock_sql_connect.side_effect = Exception("Database connection failed")

    # Input for the login endpoint
    login_request = {
        "email": "testuser@example.com",
        "password": "some_password",
    }

    # Call the endpoint
    response = client.post("/login", json=login_request)

    # Assertions
    assert response.status_code == 500
    assert response.json() == {"detail": "An unexpected error occurred."}
