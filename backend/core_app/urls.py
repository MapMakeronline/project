from django.conf import settings
from django.urls import path, re_path, include
from django.views.generic import TemplateView
from django.views.static import serve

from .views import (
    section_list, section_detail, section_tree, add_folder_to_section,
    folder_list, folder_detail, add_file_to_folder,
    file_list, file_detail,
    csrf, upload_file, get_user_info
)

urlpatterns = [
    # CSRF and Auth endpoints
    path('api/csrf/', csrf, name='csrf'),
    path('api/auth/user/', get_user_info, name='user_info'),

    # File upload endpoint
    path('api/upload/', upload_file, name='upload_file'),

    # Section endpoints
    path('api/sections/', section_list, name='section-list'),
    path('api/sections/<int:pk>/', section_detail, name='section-detail'),
    path('api/sections/tree/', section_tree, name='section-tree'),
    path('api/sections/<int:pk>/add_folder/', add_folder_to_section, name='section-add-folder'),

    # Folder endpoints
    path('api/folders/', folder_list, name='folder-list'),
    path('api/folders/<int:pk>/', folder_detail, name='folder-detail'),
    path('api/folders/<int:pk>/add_file/', add_file_to_folder, name='folder-add-file'),

    # File endpoints
    path('api/files/', file_list, name='file-list'),
    path('api/files/<int:pk>/', file_detail, name='file-detail'),

    # Static and catch-all routes
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.REACT_BUILD_PATH + '/static'}),
    re_path(r'^.*$', TemplateView.as_view(template_name='/Users/ernestilchenko/project/frontend/build/index.html')),
]