import sqlite3

import sqlite3

def sql_connect():
    # Connect to the database (or create it if it doesn't exist)
    conn = sqlite3.connect('mydatabase.db')
    return conn


def check_and_create_user_table():
    """
    Check if a table exists in the SQLite database. If not, create it.

    Args:
        db_path (str): Path to the SQLite database file.
        table_name (str): Name of the table to check/create.
    """
    # Define the table schema (modify as needed)
    create_table_query = """CREATE TABLE IF NOT EXISTS users (
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"""

    # Connect to the SQLite database
    conn =sql_connect()
    cursor = conn.cursor()
    try:
        # Check if the table exists
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
        table_exists = cursor.fetchone()

        if table_exists:
            print(f"Table users already exists.")
        else:
            # Create the table if it does not exist
            cursor.execute(create_table_query)
            conn.commit()
            print(f"Table users has been created.")
    except sqlite3.Error as e:
        print(f"check_and_create_user_table- Error occurred: {e}")
    finally:
        # Close the connection
        cursor.close()
        conn.close()


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

def check_and_create_file_metadata_table():
    """
    Check if a table exists in the SQLite database. If not, create it.

    Args:
        db_path (str): Path to the SQLite database file.
        table_name (str): Name of the table to check/create.
    """
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
    status TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"""

    # Connect to the SQLite database
    conn =sql_connect()
    cursor = conn.cursor()
    try:
        # Check if the table exists
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='file_metadata';")
        table_exists = cursor.fetchone()

        if table_exists:
            print(f"Table users already exists.")
        else:
            # Create the table if it does not exist
            cursor.execute(create_table_query)
            conn.commit()
            print(f"Table users has been created.")
    except sqlite3.Error as e:
        print(f"check_and_create_user_table- Error occurred: {e}")
    finally:
        # Close the connection
        cursor.close()
        conn.close()