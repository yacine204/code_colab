from .models import Workspace
from workspace_member.models import WorkspaceMember
from workspace_member.models import WorkspaceMember
from workspace_member.constants import WorkspaceMemberRole, WorkspaceMemberStatus
from .serializers import WorkspaceCreationSerializer
from user.models import User
from typing import Optional

def create_workspace(data:dict, owner)->Optional[dict]:
    serializer = WorkspaceCreationSerializer(data=data)
    if not serializer.is_valid(): 
        return WorkspaceCreationSerializer.errors
    new_workspace = serializer.save(owner=owner)
    WorkspaceMember.objects.create(
        workspace=new_workspace,
        member=owner,
        role=WorkspaceMemberRole.owner,
        status=WorkspaceMemberStatus.active
    )
    return WorkspaceCreationSerializer(new_workspace).data
    
# def update_workspace(data:dict, owner, workspace_id)->Optional[dict]:
#     seriliazer = WorkspaceCreationSerializer(data=data)
#     if not seriliazer.is_valid():
#         return WorkspaceCreationSerializer.errors
#     #add owner check

#     updated_workspace = Workspace.objects.get(owner=owner)
#     if update_workspace is None:
#         return None
#     for key, value in data.items():
#         setattr(update_workspace, key, value)
#     update_workspace.save()
#     return WorkspaceCreationSerializer(update_workspace).data


def update_workspace(data: dict, owner, workspace_id) -> Optional[dict]:
    try:
        workspace = Workspace.objects.get(id=workspace_id, owner=owner)
    except Workspace.DoesNotExist:
        return None

    serializer = WorkspaceCreationSerializer(workspace, data=data, partial=True)
    if not serializer.is_valid():
        return None

    serializer.save()
    return serializer.data

def get_workspace(workspace_id: int, searcher) -> Optional[dict]:
    try:
        workspace = Workspace.objects.get(id=workspace_id)
    except Workspace.DoesNotExist:
        return None
    
    is_owner = workspace.owner == searcher
    is_member = WorkspaceMember.objects.filter(workspace_id=workspace_id, member=searcher).exists()
    
    if not is_owner and not is_member:
        return None
    
    return WorkspaceCreationSerializer(workspace).data

def get_my_workspaces(user) -> list:
    owned = Workspace.objects.filter(owner=user)
    member_ids = WorkspaceMember.objects.filter(member=user).values_list('workspace_id', flat=True)
    member_of = Workspace.objects.filter(id__in=member_ids)
    workspaces = (owned | member_of).distinct()
    return WorkspaceCreationSerializer(workspaces, many=True).data



from typing import Optional
from .models import Workspace
from workspace_member.models import WorkspaceMember
from .serializers import WorkspaceCreationSerializer

def get_active_workspace_for_user(user) -> Optional[dict]:
 
    owned = Workspace.objects.filter(owner=user).order_by('-id').first()
    if owned:
        return WorkspaceCreationSerializer(owned).data

    
    active_membership = WorkspaceMember.objects.filter(
        member=user,
        status='active'
    ).order_by('-id').first()

    if active_membership:
        return WorkspaceCreationSerializer(active_membership.workspace).data
    print("user:",user)
    return None