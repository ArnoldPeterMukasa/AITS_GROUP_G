from django.urls import path
from .views import UserListView, IssueListCreateView, IssueDetailView, CommentListCreateView, NotificationListView, AuditTrailListView

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('issues/', IssueListCreateView.as_view(), name='issue-list-create'),
    path('issues/<int:pk>/', IssueDetailView.as_view(), name='issue-detail'),
    path('comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('audit-trail/', AuditTrailListView.as_view(), name='audit-trail-list'),
]