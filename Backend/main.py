from django.db import connection

connection.ensure_connection()
print("Подключение к Supabase успешно!")