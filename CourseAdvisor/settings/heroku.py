# Parse database configuration from $DATABASE_URL
from CourseAdvisor.settings import *
import dj_database_url

DEBUG = False

# DATABASES['default'] = dj_database_url.config()
DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

def get_cache():
    import os
    try:
        os.environ['MEMCACHE_SERVERS'] = os.environ['MEMCACHIER_SERVERS'].replace(',', ';')
        os.environ['MEMCACHE_USERNAME'] = os.environ['MEMCACHIER_USERNAME']
        os.environ['MEMCACHE_PASSWORD'] = os.environ['MEMCACHIER_PASSWORD']
        return {
                'default': {
                    'BACKEND': 'django_pylibmc.memcached.PyLibMCCache',
                    'TIMEOUT': 500,
                    'BINARY': True,
                    'OPTIONS': {'tcp_nodelay': True}
                    }
                }
    except:
        return {
              'default': {
                  'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
                  }
              }

CACHES = get_cache()
# CACHES = {
#         'default': {
#             'BACKEND': 'django_pylibmc.memcached.PyLibMCCache'
#             }
#         }

# Static asset configuration
import os
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../..')
STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
