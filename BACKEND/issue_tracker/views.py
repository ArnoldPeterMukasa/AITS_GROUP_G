# Description: This file contains the views for the issue_tracker app.
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Issue, Comment, Notification, AuditTrail
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, IssueSerializer, CommentSerializer, NotificationSerializer, AuditTrailSerializer
from .permissions import IsStudent, IsLecturer, IsRegistrar

from django.core.mail import send_mail


User = get_user_model()

#user registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    
    
#user login
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data             
            })
        return Response(serializer.errors, status=400)  
    
#Logout user
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=200)
        except Exception as _:
            return Response({"error": "Invalid token"}, status=400)   
    

# Get List of Users (for frontend to display user info)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsRegistrar] # Only Registrar can access

# Create and List Issues
class IssueListCreateView(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent] # Only Students can access

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)  # Assign current users as the reported_by

#  Retrieve, Update, and Delete an Issue
class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated, IsLecturer] # Only Lecturers can access

    def perform_update(self, serializer):
        issue = self.get_object()
        oldstatus = issue.status
        updated_issue = serializer.save()
        new_status = updated_issue.status
        
        #check if status has changes
        if oldstatus != new_status:
            student = updated_issue.reported_by
            subject = f"Issue '{updated_issue.title}' has been updated"
            message = f" hello {student.username},\n\n The status of your issue '{updated_issue.title}' has been updated to '{new_status}'."
            
            send_mail(subject, message, 'your_email@gmail.com', [student.email], fail_silently=False)

# List and Create Comments
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def perform_create(self, serializer):
        serializer.save(commented_by=self.request.user)

#  Get User Notifications
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

#  Get Audit Logs (Only Admin can view)
class AuditTrailListView(generics.ListAPIView):
    queryset = AuditTrail.objects.all()
    serializer_class = AuditTrailSerializer
    permission_classes = [permissions.IsAuthenticated, IsRegistrar]  # Only Registrar can access
