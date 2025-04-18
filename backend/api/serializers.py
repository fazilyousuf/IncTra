from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import UserSignup

class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSignup
        fields = ['id', 'name', 'email', 'password']

    def create(self, validated_data):
        password = validated_data.get('password')
        validated_data['password'] = make_password(password)
        return super().create(validated_data)