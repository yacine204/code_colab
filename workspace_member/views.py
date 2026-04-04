from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from . import services as member_services

class WorkspaceMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, workspace_id: int):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        result = member_services.invite(request.user, user_id, workspace_id)
        if result is None:
            return Response({"error": "not authorized or user already a member"}, status=status.HTTP_403_FORBIDDEN)
        return Response(result, status=status.HTTP_201_CREATED)

    def patch(self, request: Request, workspace_id: int):
        action = request.data.get('action')
        if action == 'join':
            result = member_services.join(request.user, workspace_id)
            if result is None:
                return Response({"error": "no membership found"}, status=status.HTTP_404_NOT_FOUND)
            return Response(result, status=status.HTTP_200_OK)
        elif action == 'leave':
            result = member_services.leave(request.user, workspace_id)
            if not result:
                return Response({"error": "not an active member"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"message": "left workspace"}, status=status.HTTP_200_OK)
        return Response({"error": "invalid action"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request: Request, workspace_id: int):
        members = member_services.get_members(workspace_id)
        return Response(members, status=status.HTTP_200_OK)
      
        
