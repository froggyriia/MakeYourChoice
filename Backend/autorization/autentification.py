
import json
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import EmailCode
from django.db import models

class user_role(models.Model):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=[("student", "Student"), ("admin", "Admin")])
    verification_code = models.CharField(max_length=6, blank=True)
    def __str__(self):
        return f"{self.email} ({self.role})"

#checking for the university's domain
def is_university_email(email: str) -> bool:
    return email.lower().endswith("@innopolis.university")

@csrf_exempt
def send_code(request):
    if request.method != "POST": #request on sending
        return JsonResponse("ERROR")
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()
    except Exception:
        return JsonResponse("ERROR")

    if not is_university_email(email):
        return JsonResponse("ERROR")

    if email.startswith("a.potyomkin" or "m.karpova" or "d.potapova" or "e.shaikhutdinova" or "s.mukhamedshina" or "v.gorbacheva" or "a.narimov"):
        role = "admin"
    else:
        role = "student"

    code = "".join(random.choices("0123456789", k=6))
    EmailCode.objects.create(email=email, code=code)
    print("Hello, " + email + "! Verification code: " + code)
    return JsonResponse({'message': 'Code generated (sent) (DEMO)'})

@csrf_exempt
def verify_code():
    if request.method != "POST":
        return JsonResponse("ERROR")
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()
        code = data.get("code", "").strip()
    except Exception:
        return JsonResponse("ERROR")

    try:
        user = UserRole.objects.get(email=email, verification_code=code)
    except UserRole.DoesNotExist:
        return JsonResponse("ERROR")

    print("Code checking " + code + " for " + email + ". Result: YEEAAAAHHH!!")
    return JsonResponse({'message': 'Authorized successfully (demo)'})

