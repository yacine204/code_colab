# urls.py
from django.urls import path
from .views import github_login, github_callback, commit_file

urlpatterns = [
    path("api/auth/github/", github_login, name="github_login"),
    path("api/auth/github/callback/", github_callback, name="github_callback"),
    path("github/commit/", commit_file, name="commit_file"),
]