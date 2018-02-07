from django.db import models
from jsonfield import JSONField


class Track(models.Model):
    name = models.CharField(unique=True, max_length=30)

    def __repr__ (self):
        return f"Track(name={self.name!r})"

    def __str__ (self):
        return self.name


class Script(models.Model):
    name = models.CharField(unique=True, max_length=30)
    parent = models.ForeignKey("self", null=True, default=None, blank=True, on_delete=models.SET_NULL)
    code = models.TextField()

    def __repr__ (self):
        return f"Script(name={self.name!r})"

    def __str__ (self):
        return self.name


class Score(models.Model):
    script = models.ForeignKey(Script, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    scores = JSONField()

    def __repr__ (self):
        return f"Score(script={self.script!r}, track={self.track!r}, scores={self.scores!r})"

    def __str__ (self):
        return f"Score for {self.script} on {self.track}"
