from django.db import models

class UserRole(models.Model):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=[("student", "Student"), ("admin", "Admin")])
    verification_code = models.CharField(max_length=6, blank=True)

    def __str__(self):
        return f"{self.email} ({self.role})"
#please

class EmailCode(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email}: {self.code}"