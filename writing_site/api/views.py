from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .models import WritingPiece, Category
from .serializers import (
    WritingPieceSerializer,
    CategorySerializer,
    RegisterSerializer,
    UserSerializer
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class WritingPieceListCreateView(generics.ListCreateAPIView):
    queryset = WritingPiece.objects.all().order_by('-created_at')
    serializer_class = WritingPieceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class WritingPieceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WritingPiece.objects.all()
    serializer_class = WritingPieceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
