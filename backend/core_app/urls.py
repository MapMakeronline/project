from django.contrib import admin
from django.urls import path, include
from .views import upload_file
urlpatterns = [
    path('api/upload/', upload_file, name='upload_file'),
]
