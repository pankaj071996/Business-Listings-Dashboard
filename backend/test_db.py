from database import engine

try:
    with engine.connect() as connection:
        print("MySQL Connection Successful!")
        print("Database connected successfully.")
except Exception as e:
    print("Connection Failed!")
    print(e)