from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseBadRequest
import json
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


def scripts_new(request, *, parent_id=None):
    # Default is a brand new script
    name = ""
    code = ""
    parent = None
    language = models.Language.objects.first()

    # Already editing, extract data from POST
    if request.method == "POST":
        if any(attr not in request.POST for attr in ("name", "code", "parent", "language")):
            return HttpResponseBadRequest()

        name = request.POST["name"]
        code = request.POST["code"]
        if request.POST["parent"]:
            parent = get_object_or_404(models.Script, id=request.POST["parent"])
        language = get_object_or_404(models.Language, id=request.POST["language"])

    # Forking another script
    elif parent_id:
        parent = get_object_or_404(models.Script, id=parent_id)
        name = f"Fork of {parent.name}"
        code = parent.code
        language = parent.language

    return render(request, "pages/scripts/new.html", {
            "name": name,
            "code": code,
            "parent": parent,
            "language": language,
            "languages": models.Language.objects.all()
        })


def scripts_run(request, *, script_id=None):
    # Run of a new script
    if request.method == "POST":
        if (not request.POST.get("name")
            or not request.POST.get("code")
            or "parent" not in request.POST
            or not request.POST.get("language")):
                return HttpResponseBadRequest()

        script = None
        name = request.POST["name"]
        code = request.POST["code"]
        if request.POST["parent"]:
            parent = get_object_or_404(models.Script, id=request.POST["parent"])
        else:
            parent = None
        language = get_object_or_404(models.Language, id=request.POST["language"])

    # Run of an existing script
    elif script_id:
        script = get_object_or_404(models.Script, id=script_id)
        name = script.name
        code = script.code
        language = script.language
        parent = script.parent

    else:
        return HttpResponseBadRequest()

    return render(request, "pages/scripts/run.html", {
            "script": script,
            "name": name,
            "code": code,
            "parent": parent,
            "language": language
        })


def scripts_submit(request, *, script_id=None):
    if (request.method != "POST"
        or not request.POST.get("scores")
        or not request.POST.get("track")):
        return HttpResponseBadRequest()

    # Additional score of an existing script
    elif script_id:
        script = get_object_or_404(models.Script, id=script_id)

    # Submission of a new script
    else:
        if (not request.POST.get("name")
            or not request.POST.get("code")
            or "parent" not in request.POST
            or not request.POST.get("language")):
                return HttpResponseBadRequest()

        name = request.POST["name"]
        code = request.POST["code"]
        if request.POST.get("parent"):
            parent = get_object_or_404(models.Script, id=request.POST["parent"])
        else:
            parent = None
        language = get_object_or_404(models.Language, id=request.POST["language"])
        script = models.Script(name=name, code=code, language=language, parent=parent)
        script.save()

    scores = request.POST["scores"]
    track = get_object_or_404(models.Track, id=request.POST["track"])

    try:
        jsscores = json.loads(scores)
        scores = {"time_taken": int(jsscores["time_taken"])}
    except Exception:
        return HttpResponseBadRequest()

    score = models.Score(script=script, track=track, scores=scores)
    score.save()

    return render(request, "pages/scripts/submit.html", {
            "script": script,
            "score": score
        })
