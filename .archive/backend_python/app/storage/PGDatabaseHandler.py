import os
import psycopg2
from psycopg2 import Error
from dotenv import load_dotenv
from pathlib import Path

def connect_to_db():
    connection = None
    env_path = os.getcwd() + '/database.env'
    load_dotenv(dotenv_path=env_path)
    postgres_user = os.getenv("POSTGRES_USER")
    postgres_password = os.getenv("POSTGRES_PASSWORD")
    if ('POSTGRES_PASSWORD' or 'POSTGRES_PASSWORD') not in os.environ:
        raise Exception('Please set environment variables POSTGRES_USER and POSTGRES_PASSWORD')
    try:
        connection = psycopg2.connect(user = postgres_user,
                                        password = postgres_password,
                                        # The host should be equal to the database service name in the docker-compose file
                                        host = 'database',      
                                        port = 5432,
                                        # The database name on initialization is equal to the username 
                                        # because no specific db name is given
                                        database = postgres_user)  
        cursor = connection.cursor()
        return cursor, connection
    except (Exception, psycopg2.Error) as error :
        raise Exception ("Error while connecting to PostgreSQL", error)

def close_db_connection(cursor, connection):
    if (connection):
        cursor.close()
        connection.close()
    else:
        print("Error while closing PostgreSQL connection: no connection found.")


def execute_sql_query(sql_query):
    # Executes a SQL query and returns the result in a list with tuples,
    # if a result is available.
    cursor, connection = connect_to_db()
    try:
        cursor.execute(sql_query)
        result = None
        # for update queries, there is nothing to fetch
        # but better solution: use cursor.statusmessage, also for .commit()
        try:
            result = cursor.fetchall()
        except:
            pass
        connection.commit()
        if result is not None:
            return result
    except (Exception, psycopg2.Error) as error:
        raise Exception ("Failed executing sql query {}".format(error))
    finally:
        close_db_connection(cursor, connection)