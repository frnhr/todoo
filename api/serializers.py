from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied
from core.models import Item
from rest_framework import serializers


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer for Item objects.
    """

    def __init__(self, *args, **kwargs):
        self.request = kwargs.get('context').get('request')
        super(ItemSerializer, self).__init__(*args, **kwargs)

    def save_object(self, obj, **kwargs):
        """
        Make sure user is not changed, raise PermissionDenied if changed.
        Also handle cases of default (None) user value: remap to current User.
        """
        if obj.user is None:
            obj.user = self.request.user
        elif obj.user != self.request.user:
            raise PermissionDenied()
        super(ItemSerializer, self).save_object(obj, **kwargs)

    title = serializers.SerializerMethodField('get_item_title')

    def get_item_title(self, obj):
        return unicode(obj)

    class Meta:
        model = Item
        fields = ('url', 'title', 'user', 'memo', 'priority', 'due_date', 'completed', )


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', )

