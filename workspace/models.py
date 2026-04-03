from django.db import models


class workspace(models.Model):
    def _auto_workspace_naming(self):
        workspace_count = self.objects.count()
        return f"workspace{workspace+1}"
    
    name = models.CharField(max_length=155, default=_auto_workspace_naming())
    github_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_name = "workspace"

    def __str__(self):
        return {"workspace: ": self.name, "github_url: ": self.github_url}
