from db.supabase_client import DATABASE
#Backend developer + DevOps/Security
import json
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import EmailCode

#checking for the university's domain
def is_university_email(email: str) -> bool:
    return email.lower().endswith('@innopolis.university')

@csrf_exempt
def send_code(request):
    if request.method != 'POST': #request on sending
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip().lower()
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not is_university_email(email):
        return JsonResponse({'error': 'Email must end with @innopolis.university'}, status=403)

    code = ''.join(random.choices('0123456789', k=6))
    EmailCode.objects.create(email=email, code=code)
    print("Hello, " + email + "! Verification code: " + code)
    return JsonResponse({'message': 'Code generated (sent) (DEMO)'})

@csrf_exempt
def verify_code():
    print("Проверка кода " +code + " для " + email + " Результат: УСПЕХ")
    return JsonResponse({'message': 'Authorized successfully (demo)'})
