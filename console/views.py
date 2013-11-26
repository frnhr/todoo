from console.decorators import render_with


@render_with('console/index.html')
def index(request):
    return {}
