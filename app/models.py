from django.db import models
from jsonfield import JSONField


class Track(models.Model):
    name = models.CharField(max_length=30)


class Script(models.Model):
    name = models.CharField(max_length=30)
    parent = models.ForeignKey("self", null=True, default=None, on_delete=models.SET_NULL)
    code = models.TextField()


class Score(models.Model):
    script = models.ForeignKey(Script, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    scores = JSONField()
