from django.contrib.auth.models import User
from core.models import Item
from rest_framework import viewsets
from api.serializers import UserSerializer, ItemSerializer


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows todoo items to be viewed or edited.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def get_queryset(self):
        return super(ItemViewSet, self).get_queryset().filter(user__id=self.request.user.id)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = super(UserViewSet, self).get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(id=self.request.user.id)
        return queryset

    def get_permissions(self):
        return super(UserViewSet, self).get_permissions()

