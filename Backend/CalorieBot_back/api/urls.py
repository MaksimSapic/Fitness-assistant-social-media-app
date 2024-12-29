from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'comments', views.CommentViewSet, basename='comment')
router.register(r'attachments', views.AttachmentViewSet, basename='attachment')

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('calculate-calories/', views.calculate_calories, name='calculate-calories'),
    path('user-statistics/<int:user_id>/', views.get_user_statistics, name='user-statistics'),
    path('profile-picture/', views.update_profile_picture, name='update_profile_picture'),
    path('profile-picture-delete/<int:user_id>/', views.delete_profile_picture, name='delete_profile_picture'),
    path('profile-picture/<int:user_id>/', views.get_profile_picture, name='get_profile_picture'),
    path('profile-picture-avatar/<int:user_id>/', views.get_profile_picture, name='get_profile_picture-avatar'),
    path('get-people/', views.get_people, name='get-people'),
    path('follow/<int:user_id>/', views.follow_user, name='follow-user'),
    path('unfollow/<int:user_id>/', views.unfollow_user, name='unfollow-user'),
    path('feed/', views.get_feed, name='user-feed'),
    path('', include(router.urls)),
]
