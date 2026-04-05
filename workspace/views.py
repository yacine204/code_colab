from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from . import services as workspace_services


class WorkspaceViews(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request: Request):
        new_workspace = workspace_services.create_workspace(request.data, request.user)
        if new_workspace is None:
            return Response({"error": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(new_workspace, status=status.HTTP_201_CREATED)
    
    def patch(self, request: Request,workspace_id: int):
        updated_workspace = workspace_services.update_workspace(request.data, request.user, workspace_id)
        if updated_workspace is None:
            return Response({"error":"workspace doesnt exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response(updated_workspace, status=status.HTTP_200_OK)
    
    def get(self, request: Request, workspace_id: int = None):
        if workspace_id:
            workspace = workspace_services.get_workspace(workspace_id, request.user)
            if workspace is None:
                return Response({"error": "workspace not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response(workspace, status=status.HTTP_200_OK)
        else:
            mode = request.query_params.get("mode", "all").strip('/')
            if mode == "active":
                # only active membership
                workspaces = workspace_services.get_active_workspace_for_user(request.user)
                print(workspaces)
                
            else:
                # all owned 
                workspaces = workspace_services.get_my_workspaces(request.user)
            
            return Response(workspaces, status=status.HTTP_200_OK)