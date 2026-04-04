from .serializers import UserProfileSerializer
from .models import User

from typing import Optional
from functools import partial
def me(user_id)->Optional[UserProfileSerializer]:
    try:
        user = User.objects.get(id=user_id)
        return UserProfileSerializer(user).data
    except User.DoesNotExist:
        return None
    
def update_profile(user_id, data:dict)->Optional[dict]:
    try:
        user = User.objects.get(id=user_id)
        for key, value in data.items():
            setattr(user,key, value)
        user.save()
        return UserProfileSerializer(user).data
    except User.DoesNotExist:
        return None