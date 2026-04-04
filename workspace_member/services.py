from .serializers import WorkspaceMemberSerializer

from .models import WorkspaceMember
from .constants import WorkspaceMemberRole, WorkspaceMemberStatus
from typing import Optional
import django.utils

def join(user, workspace_id: int) -> Optional[dict]:
    # must have been invited first
    try:
        member = WorkspaceMember.objects.get(
            workspace_id=workspace_id,
            member=user,
        )
    except WorkspaceMember.DoesNotExist:
        return None

    if member.status == WorkspaceMemberStatus.active:
        return WorkspaceMemberSerializer(member).data
    
    member.status = WorkspaceMemberStatus.active
    member.save()
    return WorkspaceMemberSerializer(member).data

def invite(inviter, user_id: int, workspace_id: int) -> Optional[dict]:
    is_authorized = WorkspaceMember.objects.filter(
        workspace_id=workspace_id,
        member=inviter,
        role__in=[WorkspaceMemberRole.owner, WorkspaceMemberRole.admin]
    ).exists()

    if not is_authorized:
        return None

    already_member = WorkspaceMember.objects.filter(
        workspace_id=workspace_id,
        member_id=user_id
    ).exists()

    if already_member:
        return None

    member = WorkspaceMember.objects.create(
        workspace_id=workspace_id,
        member_id=user_id,
        role=WorkspaceMemberRole.member,
        status=WorkspaceMemberStatus.inactive     
    )
    return WorkspaceMemberSerializer(member).data


def leave(user, workspace_id: int) -> bool:
    try:
        member = WorkspaceMember.objects.get(
            workspace_id=workspace_id,
            member=user,
            status=WorkspaceMemberStatus.active
        )
    except WorkspaceMember.DoesNotExist:
        return False

    member.status = WorkspaceMemberStatus.inactive
    member.left_at = django.utils.timezone.now()
    member.save()
    return True

def get_members(workspace_id:int)->Optional[list[dict]]:
    members = WorkspaceMember.objects.filter(
        workspace=workspace_id
        # status=WorkspaceMemberStatus.active
        )
    serializer = WorkspaceMemberSerializer(members, many=True)
    return serializer.data


