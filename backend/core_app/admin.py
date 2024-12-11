import os

from django.contrib import admin

from .models import CSVFile


# Register your models here.
@admin.register(CSVFile)
class CSVFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_file_name', 'uploaded_at')

    def get_file_name(self, obj):
        return os.path.basename(obj.file.name)

    get_file_name.short_description = 'Plik'
