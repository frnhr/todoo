from django.conf.urls import patterns, include, url
from console import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'console/login.html'}, name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}, name='logout'),
)

