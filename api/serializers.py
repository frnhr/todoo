from django.contrib.auth.models import User, Group
from rest_framework.reverse import reverse as rest_framework_reverse
from core.models import Item
from rest_framework import serializers


class ItemSerializer(serializers.HyperlinkedModelSerializer):

    def __init__(self, *args, **kwargs):
        """
        Sets current user is none is provided.
        """
        #@TODO All this should probably be moved somewhere else, a custom Field perhaps?
        data = kwargs.get('data', None)
        request = kwargs.get('context').get('request')
        if data is not None:
            url = rest_framework_reverse('user-detail', kwargs={'pk': request.user.id}, request=request)
            data['user'] = data.get('user', url)
        super(ItemSerializer, self).__init__(*args, **kwargs)

    title = serializers.SerializerMethodField('get_item_title')

    def get_default_fields(self):
        fields = super(ItemSerializer, self).get_default_fields()
        return fields

    def get_item_title(self, obj):
        return unicode(obj)

    class Meta:
        model = Item
        fields = ('url', 'title', 'user', 'memo', 'priority', 'due_date', 'completed', )


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')