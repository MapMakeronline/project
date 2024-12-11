import os

from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'error': 'No file provided'}, status=400)

        # Проверка расширения файла
        allowed_extensions = ['.geojson', '.kml', '.shp', '.csv', '.gml']
        file_ext = os.path.splitext(file.name)[1].lower()

        if file_ext not in allowed_extensions:
            return JsonResponse({'error': 'Invalid file type'}, status=400)

        # Сохранение файла
        file_path = os.path.join('uploads', file.name)
        file_path = default_storage.save(file_path, file)

        return JsonResponse({
            'message': 'File uploaded successfully',
            'file_path': file_path
        })

    return JsonResponse({'error': 'Invalid request method'}, status=405)
