class WorkspaceMemberRole:
    owner = "owner"
    admin = "admin"
    member = "member"

class WorkspaceMemberStatus:
    active = "active"
    inactive = "inactive"

WORKSPACE_MEMBER_ROLE = [
    (WorkspaceMemberRole.owner, "Owner"),
    (WorkspaceMemberRole.admin, "Admin"),
    (WorkspaceMemberRole.member, "Member"),
]

WORKSPACE_MEMBER_STATUS = [
    (WorkspaceMemberStatus.active, "Active"),
    (WorkspaceMemberStatus.inactive, "Inactive"),
]