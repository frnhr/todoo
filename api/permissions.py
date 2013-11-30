from django.contrib.auth.models import User
from rest_framework import permissions


class IsOwnerOrStaff(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        permitted = False
        try:
            permitted = obj.user == request.user
        except AttributeError:
            pass
        if isinstance(obj, User) and obj.id == request.user.id:
            permitted = True
        return permitted or request.user.is_staff
