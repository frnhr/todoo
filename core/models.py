from django.contrib.auth import get_user_model
from django.db import models


class Item(models.Model):
    user = models.ForeignKey(get_user_model())
    priority = models.PositiveIntegerField(name=u'priority', default=0, blank=True, null=False)
    due_date = models.DateField(name=u'due_date', default=None, blank=True, null=True)
    completed = models.BooleanField(name=u'completed', default=False, blank=True, null=False)
    memo = models.TextField(name=u'memo', default=u'', blank=True, null=False)

    def __unicode__(self):
        return self.memo.split("\n",1)[0].strip()