from django.contrib.auth.models import User, Group
from core.models import Item
from rest_framework import viewsets
from rest_framework import permissions as rest_fw_permissions
from api.serializers import UserSerializer, GroupSerializer, ItemSerializer
import permissions


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows todoo items to be viewed or edited.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (permissions.IsOwnerOrStaff, rest_fw_permissions.IsAuthenticated)

    def get_queryset(self):
        return super(ItemViewSet, self).get_queryset().filter(user__id=self.request.user.id)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer