from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class WritingPiece(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    document = models.FileField(upload_to='documents/')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='writings')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
