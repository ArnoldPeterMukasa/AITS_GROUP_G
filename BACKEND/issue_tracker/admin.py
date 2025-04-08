

# Register your models here.
from django.contrib import admin
from .models import User, Issue, Comment, Notification, AuditTrail

admin.site.register(User)
admin.site.register(Issue)
admin.site.register(Comment)
admin.site.register(Notification) #register the Notification model with the admin site
admin.site.register(AuditTrail)  #register the AuditTrail model with the admin site
