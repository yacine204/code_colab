from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from . import services as user_services


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request:Request):
        user_profile = user_services.me(request.user.id)
        if user_profile is None:
            return Response({"error":"user not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(user_profile, status=status.HTTP_200_OK)
    
    def patch(self, request: Request):
        user_profile_updated = user_services.update_profile(request.user.id, request.data)
        if user_profile_updated is None:
            return Response({"error":"user not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(user_profile_updated, status=status.HTTP_200_OK)