from rest_framework import serializers
from .models import Workspace

class WorkspaceCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ['name', 'github_url', 'description', 'owner']
        read_only_fields = ['id', 'owner', 'created_at']