from django.shortcuts import render

def index(request):
    return render(request, 'app/index.html')

def library(request):
    return render(request, 'app/library.html')

def login(request):
    return render(request, 'app/login/login.html')

def signup(request):
    return render(request, 'app/login/signup.html')

def logout(request):
    return render(request, 'app/login/logout.html')  

