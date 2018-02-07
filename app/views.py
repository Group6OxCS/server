from django.shortcuts import render, get_object_or_404
from . import models


def leaderboard(request):
    objs = sorted(models.Score.objects.all(), key=lambda obj: obj.scores["time_taken"])
    return render(request, "pages/leaderboard.html", {
            "leaders": objs
        })


def scripts_view(request, *, script_id):
    script = get_object_or_404(models.Script, id=script_id)
    return render(request, "pages/scripts/view.html", {
            "script": script,
            "scores": models.Score.objects.filter(script=script).order_by("track__name"),
            "children": models.Script.objects.filter(parent=script),
        })


def scripts_new(request):
    return render(request, "pages/scripts/new.html")
