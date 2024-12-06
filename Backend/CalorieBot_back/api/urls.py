from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('calculate-calories/', views.calculate_calories, name='calculate-calories'),
    path('user-statistics/<int:user_id>/', views.get_user_statistics, name='user-statistics'),
]
