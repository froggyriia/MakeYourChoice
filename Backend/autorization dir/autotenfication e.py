from db.supabase_client import DATABASE
#Backend developer

import json
import random
from datetime import timedelta

from django.http import JsonResponse
from django.core.mail import send_mail
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import EmailCode


def is_university_email(email: str) -> bool:
    """Проверка, что email принадлежит домену @innopolis.university"""
    return email.lower().endswith('@innopolis.university')


@csrf_exempt
def send_code(request):
    """Обработка запроса на отправку кода"""
    if request.method != 'POST':
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

    try:
        send_mail(
            subject='Your verification code',
            message=f'Your code is: {code}',
            from_email='your_email@innopolis.university',  # Замени на свой
            recipient_list=[email],
            fail_silently=False,
        )
    except Exception as e:
        return JsonResponse({'error': f'Failed to send email: {str(e)}'}, status=500)

    return JsonResponse({'message': 'Code sent to email'})


@csrf_exempt
def verify_code(request):
    """Обработка запроса на проверку кода"""
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip().lower()
        code = data.get('code', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not is_university_email(email):
        return JsonResponse({'error': 'Email must end with @innopolis.university'}, status=403)

    try:
        last_code = EmailCode.objects.filter(email=email).latest('created_at')
    except EmailCode.DoesNotExist:
        return JsonResponse({'error': 'No code found for this email'}, status=404)

    if last_code.code != code:
        return JsonResponse({'error': 'Invalid code'}, status=401)

    if timezone.now() - last_code.created_at > timedelta(minutes=5):
        return JsonResponse({'error': 'Code expired'}, status=403)

    request.session['user_email'] = email  # Сохраняем в сессию
    return JsonResponse({'message': 'Authorized successfully'})
