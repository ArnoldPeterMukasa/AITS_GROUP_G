# Description: This file contains the views for the issue_tracker app.
from rest_framework import generics, permissions,status,serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Issue, Notification
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, IssueSerializer, NotificationSerializer
from .permissions import IsStudent, IsLecturer, IsRegistrar
from django.db.models import Avg, Q
from datetime import timedelta, datetime
from django.core.mail import send_mail
from django.contrib.auth import authenticate

User = get_user_model()

#user registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all() #optional but a good practice
    serializer_class = RegisterSerializer #defines a serializer for the user registration

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistrarDashboardView(APIView):
    def get(self, request):
        # Extract query parameters from frontend
        department = request.query_params.get('department')
        course = request.query_params.get('course')
        status = request.query_params.get('status')

        # Query issues
        issues = Issue.objects.all()

        # Apply filters dynamically
        if department:
            issues = issues.filter(reported_by__department=department)
        if course:
            issues = issues.filter(category=course)  # Assuming "course" maps to "category"
        if status and status.lower() != 'all':
            issues = issues.filter(status=status)

        # Dashboard analytics
        total_issues = issues.count()
        unresolved_issues = issues.filter(~Q(status='resolved')).count()
        avg_time = issues.aggregate(avg_time=Avg('updated_at'))['avg_time']
        avg_resolution_time = avg_time.days if avg_time else 0

        # Overdue issues (open for more than 7 days)
        overdue_issues_count = issues.filter(
            Q(status='open') & Q(created_at__lte=datetime.now() - timedelta(days=7))
        ).count()

        # Dynamic filters for dropdown options
        departments = User.objects.values_list('department', flat=True).distinct()
        categories = Issue.objects.values_list('category', flat=True).distinct()
        statuses = ['open', 'in_progress', 'resolved', 'all']

        # Serialize issues
        serialized_issues = IssueSerializer(issues, many=True).data

        # Fetch unread notifications
        unread_notifications = Notification.objects.filter(is_read=False)
        serialized_notifications = NotificationSerializer(unread_notifications, many=True).data

        # Build and return the response
        return Response({
            'analytics': {
                'totalIssues': total_issues,
                'unresolvedIssues': unresolved_issues,
                'avgResolutionTime': avg_resolution_time,
                'overdueIssues': overdue_issues_count,
            },
            'issues': serialized_issues,
            'notifications': serialized_notifications,
            'filters': {
                'departments': list(departments),
                'categories': list(categories),
                'statuses': statuses,
            }
        })
        
class StudentDashboardView(APIView):
    authentication_classes = [JWTAuthentication]  # Secure access with JWT
    permission_classes = [IsStudent]  # Restrict access to students only

    def get(self, request):
        # Fetch the logged-in user (assumed to be a student)
        student = request.user

        # Query issues reported by the student
        issues = Issue.objects.filter(reported_by=student)

        # Apply optional filters from query parameters
        status = request.query_params.get('status')
        category = request.query_params.get('category')

        if status and status.lower() != 'all':
            issues = issues.filter(status=status)
        if category:
            issues = issues.filter(category=category)

        # Analytics for the student
        total_issues = issues.count()
        resolved_issues = issues.filter(status='resolved').count()
        unresolved_issues = total_issues - resolved_issues

        # Fetch unread notifications for the student
        notifications = Notification.objects.filter(user=student, is_read=False)
        serialized_notifications = NotificationSerializer(notifications, many=True).data

        # Serialize issues
        serialized_issues = IssueSerializer(issues, many=True).data

        # Build and return the response
        return Response({
            'student': {
                'name': f"{student.first_name} {student.last_name}",
                'email': student.email,
                'course': student.course,  # Assuming 'course' is a field in the User model
            },
            'analytics': {
                'totalIssues': total_issues,
                'resolvedIssues': resolved_issues,
                'unresolvedIssues': unresolved_issues,
            },
            'issues': serialized_issues,
            'notifications': serialized_notifications,
            'filters': {
                'statuses': ['open', 'in_progress', 'resolved', 'all'],
                'categories': ['missing_marks', 'appeal', 'correction'],
            }
        })

    
#user login
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(f"DEBUG: Received login request with data: {request.data}")
        
        serializer = LoginSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            validated_data = serializer.validated_data
            print(f"DEBUG: Login successful")
            return Response({
                'token': validated_data['token'],
                'refresh': validated_data['refresh'],
                'role': validated_data['user']['role'],
                'user': validated_data['user']
            }, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            print(f"DEBUG: Validation error: {str(e)}")
            return Response(e.detail, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"DEBUG: Unexpected error: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
#Logout user
'''class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print(f"DEBUG: Received login request with data: {request.data}")
        
        serializer = LoginSerializer(data=request.data)
        try:
            if serializer.is_valid():
                validated_data = serializer.validated_data
                print(f"DEBUG: Login successful for user: {validated_data['user']['username']}")
                return Response({
                    'token': validated_data['token'],
                    'refresh': validated_data['refresh'],
                    'role': validated_data['user']['role'],
                    'user': validated_data['user']
                }, status=status.HTTP_200_OK)
            else:
                print(f"DEBUG: Validation failed: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(f"DEBUG: Login exception: {str(e)}")
            return Response(
                {"error": "An error occurred during login"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )'''
    

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
            
#  Get User Notifications
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


