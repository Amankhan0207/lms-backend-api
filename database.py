import mysql.connector

def get_db_connection():
    try:
        
        connection = mysql.connector.connect(
            host="localhost",     
            user="root",              
            password="password",  
            database="library_db"     
        )
        
       
        return connection
        
    except mysql.connector.Error as err:
        print(f"Database is not connected: {err}")
        return None