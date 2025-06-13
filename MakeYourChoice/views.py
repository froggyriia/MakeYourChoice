from django.shortcuts import render
from django.http import HttpResponse
#please
def home(request):
    return render(request, 'templates/index.html')
