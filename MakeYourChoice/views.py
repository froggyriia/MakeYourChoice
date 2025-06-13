from django.shortcuts import render
from django.http import HttpResponse
#please
def home(request):
    return HttpResponse(":D")
