from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Issue, Comment, Notification, AuditTrail

User = get_user_model()

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

# Issue Serializer
class IssueSerializer(serializers.ModelSerializer):
    reported_by = UserSerializer(read_only=True)  # Display user info

    class Meta:
        model = Issue
        fields = '__all__'

# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    commented_by = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

# Notification Serializer
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

# Audit Trail Serializer
class AuditTrailSerializer(serializers.ModelSerializer):
    action_by = UserSerializer(read_only=True)

    class Meta:
        model = AuditTrail
        fields = '__all__'