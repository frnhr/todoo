from django.contrib import admin
from models import Item

class ItemAdmin(admin.ModelAdmin):
    list_display = ['__unicode__', 'due_date', 'completed', 'priority', 'user', ]
    list_filter = ['user', 'completed', 'priority', ]

admin.site.register(Item, ItemAdmin)