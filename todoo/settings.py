"""
Django settings for todoo project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from os import path

BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '@m2(l2(!q+r(9zy(f_@pf9_kev))fxvrd3y+bec(^+c7xuiq5k'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DIRS = (
    path.join(path.dirname(path.dirname(path.abspath(__file__))), 'templates'),
)

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'south',
    'django_extensions',
    'core',
    'api',
    'console',
    'registration',
    'rest_framework',
    'markdown',
    'django_filters',
    'django.contrib.admin',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'todoo.urls'

WSGI_APPLICATION = 'todoo.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

DEFAULT_FROM_EMAIL = 'noreply@todoo.tocka.tk'
EMAIL_HOST = 'smtp.webfaction.com'
EMAIL_HOST_PASSWORD = '25652565'
EMAIL_HOST_USER = 'todoo'
#EMAIL_USE_SSL = True
#EMAIL_PORT = 465


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

APPEND_SLASH = True

LOGIN_REDIRECT_URL = '/console/'

ACCOUNT_ACTIVATION_DAYS = 7

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('api.permissions.IsOwnerOrStaff', 'rest_framework.permissions.IsAuthenticated', ),
    'PAGINATE_BY': 10
}

