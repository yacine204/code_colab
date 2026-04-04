from rest_framework import serializers
from .models import WorkspaceMember

class WorkspaceMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceMember
        fields = ['id','role','status','joined_at','left_at','member','workspace']
        read_only_fields = ['id','role','joined_at','workspace','member']
