from django.db import models

from user.models import User

class Workspace(models.Model):
    
    name = models.CharField(max_length=155, blank=False, null=False)
    github_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_name = "workspace"

    def __str__(self):
        return {"workspace: ": self.name, "github_url: ": self.github_url}
