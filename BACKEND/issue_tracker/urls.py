from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserListView, IssueListCreateView, IssueDetailView, CommentListCreateView, NotificationListView, AuditTrailListView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('issues/', IssueListCreateView.as_view(), name='issue-list-create'),
    path('issues/<int:pk>/', IssueDetailView.as_view(), name='issue-detail'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('audit-trail/', AuditTrailListView.as_view(), name='audit-trail-list'),
]