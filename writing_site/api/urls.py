from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('writing/', views.WritingPieceListCreateView.as_view(), name='writing_list_create'),
    path('writing/<int:pk>/', views.WritingPieceDetailView.as_view(), name='writing_detail'),
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
]
