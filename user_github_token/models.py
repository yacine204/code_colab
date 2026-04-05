# models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UserGithubToken(models.Model):
    user            = models.OneToOneField(User, on_delete=models.CASCADE, related_name="github_connection")
    access_token    = models.CharField(max_length=255)
    github_username = models.CharField(max_length=100)
    created_at      = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} → {self.github_username}"