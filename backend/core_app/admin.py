import logging
import os

from django.contrib import admin
from django.contrib import messages
from django.db import connection
from django.http import FileResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import path, reverse
from django.utils.html import format_html

from .models import UploadedFile, CSVFile, DatabaseTable, Section, Folder, FileRecord


# Register your models here.
@admin.register(CSVFile)
class CSVFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'get_file_name', 'uploaded_at')

    def get_file_name(self, obj):
        return os.path.basename(obj.file.name)

    get_file_name.short_description = 'Plik'


logger = logging.getLogger(__name__)


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'file_link', 'uploaded_at', 'file_type', 'download_link')
    list_filter = ('file_type', 'uploaded_at')
    search_fields = ('title', 'file_type')
    readonly_fields = ('uploaded_at', 'download_link')
    date_hierarchy = 'uploaded_at'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'view_csv/<int:pk>/',
                self.admin_site.admin_view(self.view_csv),
                name='view-csv',
            ),
            path(
                'download/<int:pk>/',
                self.admin_site.admin_view(self.download_file),
                name='download-file',
            ),
        ]
        return custom_urls + urls

    def file_link(self, obj):
        if obj.file_type.lower() == 'csv':
            url = reverse('admin:view-csv', args=[obj.pk])
            return format_html('<a href="{}" target="_blank">Przeglądaj {}</a>', url, obj.title)
        return obj.file

    file_link.short_description = 'Plik'

    def download_link(self, obj):
        url = reverse('admin:download-file', args=[obj.pk])
        return format_html('<a href="{}" class="button">Pobierz plik</a>', url)

    download_link.short_description = 'Pobieranie'

    def view_csv(self, request, pk):
        import csv

        uploaded_file = UploadedFile.objects.get(pk=pk)

        html_content = ['<html><head><style>',
                        'table { border-collapse: collapse; width: 100%; }',
                        'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }',
                        'tr:nth-child(even) { background-color: #f2f2f2; }',
                        'th { background-color: #4CAF50; color: white; }',
                        '</style></head><body><table>']

        with uploaded_file.file.open(mode='r') as f:
            csv_reader = csv.reader(f)
            # Заголовки
            headers = next(csv_reader)
            html_content.append('<tr>')
            for header in headers:
                html_content.append(f'<th>{header}</th>')
            html_content.append('</tr>')

            # Данные
            for row in csv_reader:
                html_content.append('<tr>')
                for cell in row:
                    html_content.append(f'<td>{cell}</td>')
                html_content.append('</tr>')

        html_content.append('</table></body></html>')

        return HttpResponse(''.join(html_content))

    def download_file(self, request, pk):
        uploaded_file = UploadedFile.objects.get(pk=pk)
        response = FileResponse(uploaded_file.file, as_attachment=True)
        return response


@admin.register(DatabaseTable)
class DatabaseTableAdmin(admin.ModelAdmin):
    list_display = ('table_name', 'row_count', 'view_table_link', 'delete_table_link')
    list_display_links = ('table_name',)
    search_fields = ('table_name',)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return True

    def has_change_permission(self, request, obj=None):
        return False

    def view_table_link(self, obj):
        if obj and obj.table_name:
            url = reverse('admin:view-table-content', args=[obj.table_name])
            return format_html('<a href="{}" target="_blank">Zobacz zawartość</a>', url)
        return "N/A"

    view_table_link.short_description = 'Podgląd'

    def delete_table_link(self, obj):
        if obj and obj.table_name:
            url = reverse('admin:delete-table', args=[obj.table_name])
            return format_html(
                '<a href="{}" class="button" style="background-color: #ff4444; color: white; '
                'padding: 5px 10px; border-radius: 3px; text-decoration: none;" '
                'onclick="return confirm(\'Czy na pewno chcesz usunąć tabelę {}? '
                'Tej operacji nie można cofnąć.\')">Usuń tabelę</a>',
                url, obj.table_name
            )
        return "N/A"

    delete_table_link.short_description = 'Usuń'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'view_table/<str:table_name>/',
                self.admin_site.admin_view(self.view_table_content),
                name='view-table-content',
            ),
            path(
                'delete_table/<str:table_name>/',
                self.admin_site.admin_view(self.delete_table),
                name='delete-table',
            ),
        ]
        return custom_urls + urls

    def delete_table(self, request, table_name):
        if request.method == 'GET':
            try:
                with connection.cursor() as cursor:
                    # Проверяем существование таблицы
                    cursor.execute("""
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE table_schema = 'public' 
                            AND table_name = %s
                        )
                    """, [table_name])
                    exists = cursor.fetchone()[0]

                    if not exists:
                        messages.error(request, f'Tabela {table_name} nie istnieje.')
                    else:
                        # Удаляем таблицу
                        cursor.execute(f'DROP TABLE "{table_name}" CASCADE')
                        messages.success(request, f'Tabela {table_name} została usunięta.')
            except Exception as e:
                logger.error(f"Error deleting table {table_name}: {str(e)}")
                messages.error(request, f'Błąd podczas usuwania tabeli: {str(e)}')

            return HttpResponseRedirect(reverse('admin:core_app_databasetable_changelist'))

    def view_table_content(self, request, table_name):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name = %s
                    )
                """, [table_name])
                exists = cursor.fetchone()[0]

                if not exists:
                    return HttpResponse(f"Tabela {table_name} nie istnieje")

                cursor.execute("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = %s
                    ORDER BY ordinal_position
                """, [table_name])
                columns = [col[0] for col in cursor.fetchall()]

                cursor.execute(f'SELECT * FROM "{table_name}" LIMIT 1000')
                rows = cursor.fetchall()

                html_content = ['<html><head><style>',
                                'table { border-collapse: collapse; width: 100%; margin-top: 20px; }',
                                'th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }',
                                'tr:nth-child(even) { background-color: #f2f2f2; }',
                                'th { background-color: #4CAF50; color: white; }',
                                '.table-info { padding: 10px; background-color: #f8f9fa; border-radius: 5px; }',
                                '</style></head><body>',
                                f'<div class="table-info">',
                                f'<h2>Tabela: {table_name}</h2>',
                                f'<p>Liczba kolumn: {len(columns)}</p>',
                                f'<p>Wyświetlone rekordy: {len(rows)} (maksymalnie 1000)</p>',
                                '</div><table>']

                html_content.append('<tr>')
                for column in columns:
                    html_content.append(f'<th>{column}</th>')
                html_content.append('</tr>')

                for row in rows:
                    html_content.append('<tr>')
                    for cell in row:
                        html_content.append(f'<td>{cell if cell is not None else ""}</td>')
                    html_content.append('</tr>')

                html_content.append('</table></body></html>')

                return HttpResponse(''.join(html_content))
        except Exception as e:
            logger.error(f"Error viewing table {table_name}: {str(e)}")
            return HttpResponse(f"Błąd podczas wyświetlania tabeli: {str(e)}")


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'order', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('name', 'user__email')
    ordering = ('order', 'created_at')
    readonly_fields = ('id', 'created_at')


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'section', 'order', 'created_at')
    list_filter = ('section', 'created_at')
    search_fields = ('name', 'section__name')
    ordering = ('order', 'created_at')
    readonly_fields = ('id', 'created_at')


@admin.register(FileRecord)
class FileRecordAdmin(admin.ModelAdmin):
    list_display = ('name', 'folder', 'file_type', 'order', 'created_at')
    list_filter = ('file_type', 'folder', 'created_at')
    search_fields = ('name', 'folder__name')
    ordering = ('order', 'created_at')
    readonly_fields = ('id', 'created_at')
