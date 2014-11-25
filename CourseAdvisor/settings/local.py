"""Development settings and globals."""

from __future__ import absolute_import

from os.path import join, normpath

from CourseAdvisor.settings import *

# ######### DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True

# See: https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
TEMPLATE_DEBUG = DEBUG
# ######### END DEBUG CONFIGURATION


# ######### EMAIL CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# ######### END EMAIL CONFIGURATION


# ######### DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
DATABASES = {
    # If use sqlite
    # 'default': {
    #    'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': 'mydatabase',
    # }
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'courseadvisor',
        'USER': 'courseadvisor',
        'PASSWORD': 'CourseAdvisor',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
# ######### END DATABASE CONFIGURATION


# ######### CACHE CONFIGURATION
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
# ######### END CACHE CONFIGURATION


# ######### TOOLBAR CONFIGURATION
# See: http://django-debug-toolbar.readthedocs.org/en/latest/installation.html#explicit-setup
INSTALLED_APPS += (
    'debug_toolbar',
)

MIDDLEWARE_CLASSES += (
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

DEBUG_TOOLBAR_PATCH_SETTINGS = False

# http://django-debug-toolbar.readthedocs.org/en/latest/installation.html
INTERNAL_IPS = ('127.0.0.1',)
# ######### END TOOLBAR CONFIGURATION
