from django.contrib.auth.decorators import login_required
from console.decorators import render_with


@login_required(login_url='/console/login/')
@render_with('console/index.html')
def index(request):
    return {}


@render_with('console/login.html')
def login(request):
    return {}