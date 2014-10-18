# Parse database configuration from $DATABASE_URL
import dj_database_url

from .base import *

DEBUG = False

LOCAL_APPS += ('debug_toolbar', )

# DATABASES['default'] = dj_database_url.config()
DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']
'''
CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
            }
        }
'''
from memcacheify import memcacheify

CACHES = memcacheify()

# Static asset configuration
import os
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../..')
STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
