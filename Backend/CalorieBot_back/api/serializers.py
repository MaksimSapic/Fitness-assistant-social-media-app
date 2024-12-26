from rest_framework import serializers
from .models import User, WorkoutSession, Post, Comment, Attachment

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    bmi = serializers.FloatField(read_only=True)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 
            'password', 'weight', 'height', 'gender', 'age', 
            'fat_percentage', 'workout_frequency', 'bmi', 
            'experience_level', 'preferred_theme', 'followers_count',
            'following_count', 'posts_count', 'biography', 'profile_picture'
        )
        read_only_fields = ('id', 'bmi', 'followers_count', 'following_count', 'posts_count')

    def create(self, validated_data):
        password = validated_data.pop('password')
        weight = validated_data.get('weight')
        height = validated_data.get('height')
        bmi = weight / (height * height)
        
        user = User(**validated_data, bmi=bmi)
        user.set_password(password)
        user.save()
        return user

class WorkoutSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = (
            'id', 'heart_avg', 
            'workout_type', 'session_duration', 'water_intake', 
            'calories_burned', 'created_at'
        )

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'created_at', 'likes_count', 'comments_count']
        read_only_fields = ['user', 'likes_count', 'comments_count']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'content', 'created_at']

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'post', 'file', 'created_at']
