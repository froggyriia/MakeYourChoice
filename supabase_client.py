from dotenv import load_dotenv
import os

load_dotenv()  # Загружает переменные из .env

supabase_url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print(supabase_url)  # Проверка загрузки