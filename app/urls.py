from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="app_index"),

    url(r"^leaderboard/(?:(?P<track_id>\d+)/)?$", views.leaderboard, name="app_leaderboard"),

    url(r"^inheritance/$", views.inheritance, name="app_inheritance"),

    url(r"^play/$", views.play, name="app_play"),
    url(r"^play/submit/$", views.play_submit, name="app_play_submit"),

    url(r"^scripts/check/$", views.check_script, name="app_check_script"),

    url(r"^scripts/(?P<script_id>\d+)/view/$", views.scripts_view, name="app_scripts_view"),

    url(r"^scripts/new/$", views.scripts_new, name="app_scripts_new"),
    url(r"^scripts/(?P<parent_id>\d+)/fork/$", views.scripts_new, name="app_scripts_fork"),

    url(r"^scripts/run/$", views.scripts_run, name="app_scripts_run"),
    url(r"^scripts/(?P<script_id>\d+)/run/$", views.scripts_run, name="app_scripts_run_existing"),

    url(r"^scripts/submit/$", views.scripts_submit, name="app_scripts_submit"),
    url(r"^scripts/(?P<script_id>\d+)/submit/$", views.scripts_submit, name="app_scripts_submit_existing"),
]
