class WorkspaceMemberRole:
    admin = "admin"
    member = "member"

class WorkspaceMemberStatus: 
    inactive = "inactive"
    active = "active"


WORKSPACE_MEMBER_ROLE = [
    (WorkspaceMemberRole.admin, "Admin"),
    (WorkspaceMemberRole.member, "Member")
]

WORKSPACE_MEMBER_STATUS = [
    (WorkspaceMemberStatus.active, "Acvite"),
    (WorkspaceMemberStatus.inactive, "Inactive")
]

