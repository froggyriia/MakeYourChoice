#from db.supabase_client import DATABASE
#Backend developer + DevOps/Security
import json
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from MakeYourChoice.models import EmailCode
from MakeYourChoice.models import UserRole
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
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=400)
    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()
    except Exception:
        return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
    if not is_university_email(email):
        return JsonResponse({"status": "error", "message": "Invalid university email"}, status=400)

    admin_prefixes = ["a.potyomkin", "m.karpova", "d.potapova","e.shaikhutdinova", "s.mukhamedshina","v.gorbacheva", "a.narimov"]
    role = "admin" if any(email.startswith(prefix) for prefix in admin_prefixes) else "student"

    code = "".join(random.choices("0123456789", k=6))


    print(f"Verification code for {email}: {code}")
    return JsonResponse({'status': 'success', 'message': 'Code generated'})


@csrf_exempt
def verify_code(request):
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)
    else:
        return JsonResponse({"status": "success", "message": "Verified successfully"}, status=200)