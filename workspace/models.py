from django.db import models

from user.models import User

class Workspace(models.Model):
    
    name = models.CharField(max_length=155, blank=False, null=False)
    github_url = models.URLField(null=True, blank=True)
    description = models.CharField(max_length=255, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workspaces', null=True)

    class Meta:
        db_table = "workspace"

    def __str__(self):
        return {"workspace: ": self.name, "github_url: ": self.github_url}
