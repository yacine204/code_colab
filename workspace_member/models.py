from django.db import models

from user.models import User
from workspace.models import Workspace

from typing import Optional

from .constants import WORKSPACE_MEMBER_ROLE, WORKSPACE_MEMBER_STATUS


class WorkspaceMember(models.Model):

    def _get_user_from_workspace(self)->Optional[User]:
        return User.objects.filter(user_id=self.member).first()
    

    #enums
    role = models.CharField(max_length=155, choices=WORKSPACE_MEMBER_ROLE)
    status = models.CharField(max_length=155, choices = WORKSPACE_MEMBER_STATUS)

    #timetamps
    joined_at = models.TimeField(auto_now=True)
    left_at = models.TimeField(blank=True, null=True)
    added_at = models.DateField(auto_now_add=True, blank=False, null=False)

    #foreign keys
    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='member')
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='workspace')

    class Meta: 
        db_table = 'workspace_member'

    def _str__(self):
        user: User = self._get_user_from_workspace(self)
        return {"pseudo: ": user.pseudo, "status: ": self.status, "workspace_id: ": self.workspace}