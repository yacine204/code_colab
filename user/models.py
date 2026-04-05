from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, pseudo, password=None):
        user = self.model(email=self.normalize_email(email), pseudo=pseudo)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, pseudo, password):
        user = self.create_user(email, pseudo, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    pseudo = models.CharField(max_length=155, unique=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    pfp = models.CharField(max_length=255, null=True, blank=True)
    github_token = models.CharField(max_length=255, null= True, blank=True)
    is_active = models.BooleanField(default=True)
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['pseudo']

    objects = UserManager()

    class Meta:
        db_table = 'user'

    def __str__(self):
        return self.email

    @property
    def avatar_url(self):
        if self.pfp:
            return self.pfp
        return f"https://api.dicebear.com/9.x/identicon/svg?seed={self.pseudo}"