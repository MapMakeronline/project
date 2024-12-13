from django.conf import settings
from django.urls import path, re_path
from django.views.generic import TemplateView
from django.views.static import serve

from .views import upload_file, get_user_info

urlpatterns = [
    path('api/auth/user/', get_user_info, name='user_info'),
    path('api/upload/', upload_file, name='upload_file'),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.REACT_BUILD_PATH + '/static'}),
    re_path(r'^.*$', TemplateView.as_view(template_name='/Users/ernestilchenko/project/frontend/build/index.html')),
]
