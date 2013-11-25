from django.contrib.auth.models import User, Group
from core.models import Item
from rest_framework import serializers



class ItemSerializer(serializers.HyperlinkedModelSerializer):

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