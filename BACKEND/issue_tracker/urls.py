from django.urls import path, include
from .views import RegisterView, LoginView, StudentDashboardView, LecturerDashboardView, UserListView, IssueListCreateView, IssueDetailView, NotificationViewSet,RegistrarDashboardView
#UnassignedIssuesView, AssignIssueView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    #path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh token
    path('users/', UserListView.as_view(), name='user-list'),
    path('issues/', IssueListCreateView.as_view(), name='issue-list-create'),
    path('issues/<int:pk>/', IssueDetailView.as_view(), name='issue-detail'),
    # path('notifications/', NotificationViewSet.as_view(), name='notification-list'),
    path('RegistrarDashboard/', RegistrarDashboardView.as_view(), name='registrar-dashboard'),
    #path('api/RegistrarDashboard/', RegistrarDashboardView.as_view(), name='registrar-dashboard'),
    path('StudentDashboard/', StudentDashboardView.as_view(), name='student_dashboard'),
    path('dashboard/lecturer/', LecturerDashboardView.as_view(), name='lecturer_dashboard'),
    #path('issues/unassigned/', UnassignedIssuesView.as_view(), name='unassigned-issues'),
    #path('issues/<int:pk>/assign/', AssignIssueView.as_view(), name='assign-issue'), 
    path('', include(router.urls)),
] 