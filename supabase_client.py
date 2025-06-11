import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

# Пример запроса
def get_users():
    response = supabase.table("users").select("*").execute()
    print(response.data)

if __name__ == "__main__":
    get_users()