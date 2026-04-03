from django.db import models

class user(models.Model):
    pseudo = models.CharField(max_length=155, unique=True, null=False)
    email = models.EmailField(null=False)
    hashedPassword = models.CharField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "user"          
        verbose_name_plural = "user"
        db_table = "user"

    def __str__(self):
        return {"pseudo": self.pseudo, "email: ": self.email}