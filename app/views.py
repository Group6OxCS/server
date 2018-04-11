from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseBadRequest
from django.db import transaction
import json
from . import models


SCORES_ATTRS = ["time", "fuel_used", "top_speed"]
SCORES_TITLES = ["Time (s)", "Fuel Used", "Top Speed (m/s)"]


def index(request):
    return redirect("app_leaderboard")


def leaderboard(request, *, track_id=None):
    if track_id is None:
        track = models.Track.objects.all()[0]
    else:
        track = get_object_or_404(models.Track, id=track_id)
    scripts = models.Script.objects.all()
    scores = {x.script.id: x for x in models.Score.objects.filter(track=track)}
    objs = [(s, scores.get(s.id)) for s in scripts]

    return render(request, "pages/leaderboard.html", {
            "leaders": objs,
            "track": track,
            "tracks": models.Track.objects.all(),
            "score_attrs": SCORES_ATTRS,
            "score_titles": SCORES_TITLES
        })


def inheritance(request, *, track_id=None):
    if track_id is None:
        track = models.Track.objects.all()[0]
    else:
        track = get_object_or_404(models.Track, id=track_id)
    scripts = models.Script.objects.all()
    scores = {x.script.id: x for x in models.Score.objects.filter(track=track)}
    objs = [(s, scores.get(s.id)) for s in scripts]

    return render(request, "pages/inheritance.html", {
            "scripts": objs,
            "track": track,
            "tracks": models.Track.objects.all(),
            "score_attrs": SCORES_ATTRS,
            "score_titles": SCORES_TITLES
        })


def scripts_view(request, *, script_id):
    script = get_object_or_404(models.Script, id=script_id)
    tracks = models.Track.objects.all()
    scores = {x.track.id: x for x in models.Score.objects.filter(script=script)}
    objs = [(t, scores.get(t.id)) for t in tracks]
    return render(request, "pages/scripts/view.html", {
            "script": script,
            "scores": objs,
            "children": models.Script.objects.filter(parent=script),
            "score_attrs": SCORES_ATTRS,
            "score_titles": SCORES_TITLES
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
        or not request.POST.get("scores")):
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

    try:
        scores = json.loads(scores)
        track = get_object_or_404(models.Track, level=scores["track"])
    except Exception:
        return HttpResponseBadRequest()

    with transaction.atomic():
        # Replace score for this track
        models.Score.objects.filter(script=script, track=track).delete()
        score = models.Score(script=script, track=track, scores=scores)
        score.save()

    return render(request, "pages/scripts/submit.html", {
            "script": script,
            "score": score
        })
