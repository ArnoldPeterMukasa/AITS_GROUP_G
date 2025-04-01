# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractUser


# Custom User Model
class User(AbstractUser):
    USER_TYPES = [
        ('student', 'student'),
        ('lecturer', 'Lecturer'),
        ('registrar', 'Academic Registrar'),
    ]
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    department = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"


# Issue Model
class Issue(models.Model):
    ISSUE_CATEGORIES = [
        ('missing_marks', 'Missing Marks'),
        ('appeal', 'Appeal'),
        ('correction', 'Correction'), ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=ISSUE_CATEGORIES)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_issues')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='assigned_issues', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"



#  Notification Model
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - Read: {self.is_read}"



    def __str__(self):
        return f"Audit Log: {self.action_by.username} - {self.timestamp}"
