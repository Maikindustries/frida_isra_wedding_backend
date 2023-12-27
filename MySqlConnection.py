import mysql.connector
from decouple import config

class ConnectionFactory:
  def get_connection(self,
               db_host=config("DB_HOST"),
               db_username=config("DB_USERNAME"),
               db_password=config("DB_PASSWORD"),
               db_name=config("DB_NAME"),):
    self.conn = mysql.connector.connect(
      host=db_host, user=db_username, password=db_password, database=db_name
    )
    
    return self.conn, self.conn.cursor()