import os

from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UploadedFile
from .serializers import UserSerializer


# Create your views here.
@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES.get('file')

        if not file:
            return JsonResponse({'error': 'No file provided'}, status=400)

        # Получаем имя файла без расширения для title
        title = os.path.splitext(file.name)[0]

        # Проверка расширения файла
        allowed_extensions = ['.geojson', '.kml', '.shp', '.csv', '.gml']
        file_ext = os.path.splitext(file.name)[1].lower()

        if file_ext not in allowed_extensions:
            return JsonResponse({'error': 'Invalid file type'}, status=400)

        # Сохранение файла и создание записи в базе данных
        file_path = os.path.join('uploads', file.name)
        saved_path = default_storage.save(file_path, file)

        try:
            # Создание записи в базе данных
            uploaded_file = UploadedFile.objects.create(
                title=title,  # Используем имя файла без расширения
                file=saved_path,
                file_type=file_ext[1:]  # убираем точку из расширения
            )

            return JsonResponse({
                'message': 'File uploaded successfully',
                'file_path': saved_path,
                'id': uploaded_file.id,
                'title': title
            })
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    serializer = UserSerializer(request.user)
    return Response({
        **serializer.data,
        'isAuthenticated': True
    })
