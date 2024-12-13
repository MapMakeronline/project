from rest_framework import serializers
from django.contrib.auth import get_user_model
from allauth.socialaccount.models import SocialAccount

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