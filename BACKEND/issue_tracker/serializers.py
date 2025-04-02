from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Issue, Comment, Notification, AuditTrail
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name', 'username', 'email', 'user_type', 'department']

# Issue Serializer
class IssueSerializer(serializers.ModelSerializer):
    reported_by = UserSerializer(read_only=True)  # Display user info

    class Meta:
        model = Issue
        fields = ['id', 'description', 'category', 'status', 'reported_by', 'assigned_to', 'created_at', 'updated_at']

# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    commented_by = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'issue', 'commented_by', 'text', 'created_at']

# Notification Serializer
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields =['id', 'user', 'issue', 'message', 'is_read', 'created_at']

# Audit Trail Serializer
class AuditTrailSerializer(serializers.ModelSerializer):
    action_by = UserSerializer(read_only=True)

    class Meta:
        model = AuditTrail
        fields = ['id', 'issue', 'action_by', 'action_description', 'timestamp']

# User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    registration_number = serializers.CharField(required=False, allow_blank=True)
    course = serializers.CharField(required=False, allow_blank=True)
    lecturer_id = serializers.CharField(required=False, allow_blank=True)
    academic_title = serializers.CharField(required=False, allow_blank=True)

    
    class Meta:
        model = User
        #fields = ['id', 'username', 'email', 'password', 'user_type', 'department']
        fields = [
            'username', 'email', 'password', 'user_type', 'department',
            'first_name', 'last_name',  # Include first_name and last_name
            'registration_number', 'course', 'lecturer_id', 'academic_title'
        ]

        def create(self, validated_data):
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data['password'],
                user_type=validated_data['user_type'],
                department=validated_data.get('department', None),
                registration_number=validated_data.get('registration_number', None),
                course=validated_data.get('course', None),
                lecturer_id=validated_data.get('lecturer_id', None),
                academic_title=validated_data.get('academic_title', None),
            )
            return user


    '''def validate_user_type(self, value):
        valid_types = ['student', 'lecturer','registrar']
        if value not in valid_types:
            raise serializers.ValidationError("Invalid user_type. Must be student, lecturer,  or registrar.")
        return value    
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user'''

# User Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid Credentials")
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_data': UserSerializer(user).data,
            'user': user
        }