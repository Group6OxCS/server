from django.contrib import admin
from . import models


admin.site.register(models.Track)
admin.site.register(models.Language)
admin.site.register(models.Script)
admin.site.register(models.Score)
