from allauth.socialaccount.models import SocialAccount
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Section, Folder, FileRecord

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    picture = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'picture']

    def get_picture(self, obj):
        try:
            social_account = obj.socialaccount_set.get(provider='google')
            return social_account.extra_data.get('picture', '')
        except SocialAccount.DoesNotExist:
            return ''

    def get_name(self, obj):
        try:
            social_account = obj.socialaccount_set.get(provider='google')
            return social_account.extra_data.get('name', obj.get_full_name())
        except SocialAccount.DoesNotExist:
            return obj.get_full_name() or obj.email


class FileRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileRecord
        fields = ['id', 'name', 'file_type', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class FolderSerializer(serializers.ModelSerializer):
    files = FileRecordSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ['id', 'name', 'order', 'files', 'created_at']
        read_only_fields = ['id', 'created_at']


class SectionSerializer(serializers.ModelSerializer):
    folders = FolderSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ['id', 'name', 'order', 'folders', 'created_at']
        read_only_fields = ['id', 'created_at']


class SectionTreeSerializer(serializers.ModelSerializer):
    """Сериализатор для получения полного дерева"""
    folders = FolderSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ['id', 'name', 'order', 'folders']
