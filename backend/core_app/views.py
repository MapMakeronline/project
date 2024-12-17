import os

from django.core.files.storage import default_storage
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import UploadedFile, Folder, FileRecord, Section
from .serializers import UserSerializer, SectionTreeSerializer, FolderSerializer, FileRecordSerializer, \
    SectionSerializer


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
def get_user_info(request):
    print("Session ID:", request.session.session_key)
    print("Is authenticated:", request.user.is_authenticated)
    print("User:", request.user)
    print("Cookies:", request.COOKIES)

    if not request.user.is_authenticated:
        return Response({'isAuthenticated': False})

    serializer = UserSerializer(request.user)
    return Response({
        **serializer.data,
        'isAuthenticated': True
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def section_list(request):
    if request.method == 'GET':
        sections = Section.objects.filter(user=request.user).prefetch_related(
            'folders',
            'folders__files'
        )
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def section_detail(request, pk):
    section = get_object_or_404(Section, pk=pk, user=request.user)

    if request.method == 'GET':
        serializer = SectionSerializer(section)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = SectionSerializer(section, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        section.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def section_tree(request):
    """Получить полное дерево секций с папками и файлами"""
    sections = Section.objects.filter(user=request.user).prefetch_related(
        'folders',
        'folders__files'
    ).order_by('order')
    serializer = SectionTreeSerializer(sections, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_folder_to_section(request, pk):
    """Добавить папку в секцию"""
    section = get_object_or_404(Section, pk=pk, user=request.user)
    serializer = FolderSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(section=section)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def folder_list(request):
    if request.method == 'GET':
        folders = Folder.objects.filter(section__user=request.user).prefetch_related('files')
        serializer = FolderSerializer(folders, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FolderSerializer(data=request.data)
        if serializer.is_valid():
            # Verify the section belongs to the user
            section = get_object_or_404(Section, id=request.data.get('section'), user=request.user)
            serializer.save(section=section)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def folder_detail(request, pk):
    folder = get_object_or_404(Folder, pk=pk, section__user=request.user)

    if request.method == 'GET':
        serializer = FolderSerializer(folder)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = FolderSerializer(folder, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        folder.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_file_to_folder(request, pk):
    """Добавить файл в папку"""
    folder = get_object_or_404(Folder, pk=pk, section__user=request.user)
    serializer = FileRecordSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(folder=folder)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def file_list(request):
    if request.method == 'GET':
        files = FileRecord.objects.filter(folder__section__user=request.user)
        serializer = FileRecordSerializer(files, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FileRecordSerializer(data=request.data)
        if serializer.is_valid():
            # Verify the folder belongs to the user
            folder = get_object_or_404(Folder, id=request.data.get('folder'), section__user=request.user)
            serializer.save(folder=folder)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def file_detail(request, pk):
    file = get_object_or_404(FileRecord, pk=pk, folder__section__user=request.user)

    if request.method == 'GET':
        serializer = FileRecordSerializer(file)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = FileRecordSerializer(file, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@ensure_csrf_cookie
def csrf(request):
    return HttpResponse()