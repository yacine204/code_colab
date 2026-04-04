from django.db import models
from user.models import User
from workspace.models import Workspace
from .constants import WORKSPACE_MEMBER_ROLE, WORKSPACE_MEMBER_STATUS

class WorkspaceMember(models.Model):
    role = models.CharField(max_length=50, choices=WORKSPACE_MEMBER_ROLE)
    status = models.CharField(max_length=50, choices=WORKSPACE_MEMBER_STATUS)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(blank=True, null=True)
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='members')

    class Meta:
        db_table = 'workspace_member'

    def __str__(self):
        return f"{self.member.pseudo} - {self.workspace.name}"