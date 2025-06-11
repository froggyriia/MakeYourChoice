from db.supabase_client import DATABASE
from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    id = models.IntegerField()
    short_name = models.CharField(max_length=10)
    full_name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.short_name