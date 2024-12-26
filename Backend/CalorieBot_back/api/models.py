from django.db import models
import hashlib
import os
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    hash = models.CharField(max_length=128)
    salt = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Required fields for Django auth
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Your existing fields
    preferred_theme = models.BooleanField(default=False)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    posts_count = models.PositiveIntegerField(default=0)
    biography = models.TextField(blank=True)
    profile_picture = models.BinaryField(null=True, blank=True)
    profile_picture_type = models.CharField(max_length=100, null=True, blank=True)  # To store mime type
    weight = models.FloatField(validators=[MinValueValidator(20.0), MaxValueValidator(300.0)])
    height = models.FloatField(validators=[MinValueValidator(0.5), MaxValueValidator(3.0)])
    gender = models.CharField(max_length=1, choices=[('M', 'Male'), ('F', 'Female')])
    age = models.IntegerField(validators=[MinValueValidator(13), MaxValueValidator(120)])
    fat_percentage = models.FloatField(validators=[MinValueValidator(2.0), MaxValueValidator(70.0)])
    workout_frequency = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    bmi = models.FloatField(editable=False)
    experience_level = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'users'

    # Keep your existing methods
    def set_password(self, password):
        self.salt = os.urandom(16).hex()
        self.hash = self._hash_password(password, self.salt)

    def check_password(self, password):
        return self._hash_password(password, self.salt) == self.hash

    @staticmethod
    def _hash_password(password, salt):
        salted = password.encode() + bytes.fromhex(salt)
        return hashlib.sha512(salted).hexdigest()

class WorkoutSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_sessions')
    heart_avg = models.IntegerField()
    workout_type = models.CharField(max_length=50)
    session_duration = models.FloatField()
    water_intake = models.FloatField()
    calories_burned = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workout_sessions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s workout on {self.created_at}"

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Attachment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='attachments')
    file = models.BinaryField()
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)