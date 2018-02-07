from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.leaderboard, name="app_leaderboard"),
    url(r"^scripts/view/(?P<script_id>\d+)/$", views.scripts_view, name="app_scripts_view"),
    url(r"^scripts/new/$", views.scripts_new, name="app_scripts_new"),
]

