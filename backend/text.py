from services.sql_connection import sql_connect
import sqlite3

def get_details(file_name):
    conn = sql_connect()
    cursor = conn.cursor()
    sql=f"""select * from file_metadata where file_name='{file_name}'"""
    cursor.execute(sql)
    details_list=cursor.fetchall()[0]
    details={"file_name":details_list[1],
    "domain":details_list[7]}
    return details

get_details("hr_Attention.pdf")