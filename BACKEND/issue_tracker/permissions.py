from rest_framework import permissions

class IsStudent(permissions.BasePermissiob):
    def has_permission(self,request,view):
        return request.user.is_authenticated and reque  st.user.user_type == 'student'

class IsLecturer(permissions.BasePermissions):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.user_type == 'lecturer'

class IsRegistrar(permissions.BasePermissions):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.user_type == 'registrar'