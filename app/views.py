from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponseBadRequest, Http404, HttpResponse
from django.db import transaction
import json
from . import models


SCORES_ATTRS = ["time", "fuel_used", "top_speed", "average_speed", "nitro_usage"]
SCORES_TITLES = ["Time (s)", "Fuel Used", "Top Speed (m/s)", "Average Speed (m/s)", "Nitro Usage"]


def index(request):
    return redirect("app_leaderboard")


def leaderboard(request, *, track_id=None):
    if track_id is None:
        track = models.Track.objects.all()[0]
    else:
        track = get_object_or_404(models.Track, id=track_id)
    scripts = models.Script.objects.all().prefetch_related("language")
    scores = {x.script_id: x for x in models.Score.objects.filter(track=track)}
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
    scripts = models.Script.objects.all().prefetch_related("parent")
    scores = {x.script_id: x for x in models.Score.objects.filter(track=track)}
    objs = [(s, scores.get(s.id)) for s in scripts]

    return render(request, "pages/inheritance.html", {
            "scripts": objs,
            "track": track,
            "tracks": models.Track.objects.all(),
            "score_attrs": SCORES_ATTRS,
            "score_titles": SCORES_TITLES
        })


def play(request):
    if request.GET.get("withreplay", request.POST.get("withreplay", "off")) == "on":
        if not request.GET.get("replay", request.POST.get("replay")):
            return HttpResponseBadRequest()
        replay = get_object_or_404(models.Script, id=request.GET.get("replay", request.POST.get("replay")))
    else:
        replay = None

    return render(request, "pages/play.html", {
            "replay": replay,
            "replay_scores": list(models.Score.objects.filter(script=replay)) if replay else [],
            "script_scores": list(models.Score.objects.filter(script__name="Humans")),
        })


def play_submit(request):
    if (request.method != "POST"
        or not request.POST.get("scores")):
        return HttpResponseBadRequest()

    human_script, save = models.Script.objects.get_or_create(name="Humans")
    if save:
        human_script.save()

    scores = request.POST["scores"]

    try:
        scores = json.loads(scores)
        track = get_object_or_404(models.Track, level=scores["track"])
    except Exception:
        return HttpResponseBadRequest()

    with transaction.atomic():
        # Replace score for this track
        models.Score.objects.filter(script=human_script, track=track).delete()
        score = models.Score(script=human_script, track=track, scores=scores)
        score.save()

    return redirect("app_leaderboard", track.id)


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
            "score_titles": SCORES_TITLES,
            "scripts": list(models.Script.objects.order_by("name").all())
        })


def scripts_new(request, *, parent_id=None):
    # Default is a brand new script
    name = ""
    code = ""
    parent = None
    languages = list(models.Language.objects.all())
    language = languages[0]

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
            "languages": languages,
            "scripts": list(models.Script.objects.order_by("name").all())
        })


def check_script(request):
    if request.method != "POST" or "name" not in request.POST or "code" not in request.POST:
        return HttpResponseBadRequest()
    if not request.POST["name"]:
        return HttpResponse("Name must not be empty")
    try:
        models.Script.objects.get(name=request.POST["name"])
    except models.Script.DoesNotExist:
        pass
    else:
        return HttpResponse("Name must be unique")
    if not request.POST["code"]:
        return HttpResponse("Code must not be empty")
    return HttpResponse("")


def scripts_run(request, *, script_id=None):
    print(request.GET.keys(), request.POST.keys())
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

    if request.GET.get("withreplay", request.POST.get("withreplay", "off")) == "on":
        if not request.GET.get("replay", request.POST.get("replay")):
            return HttpResponseBadRequest()
        replay = get_object_or_404(models.Script, id=request.GET.get("replay", request.POST.get("replay")))
    else:
        replay = None

    return render(request, "pages/scripts/run.html", {
            "script": script,
            "name": name,
            "code": code,
            "parent": parent,
            "replay": replay,
            "replay_scores": list(models.Score.objects.filter(script=replay)) if replay else [],
            "script_scores": list(models.Score.objects.filter(script=script)) if script else [],
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
            or not request.POST.get("language")
            or request.POST.get("name") == "Humans"):
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

    return redirect("app_scripts_view", script.id)
    return render(request, "pages/scripts/submit.html", {
            "script": script,
            "score": score
        })
