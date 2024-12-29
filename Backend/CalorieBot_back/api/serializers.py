from rest_framework import serializers
from .models import User, WorkoutSession, Post, Comment, Attachment
import base64

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

class userDTO(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'first_name', 'last_name', 
            'profile_picture_avatar'
        )
        read_only_fields = ('id', 'username', 'first_name', 'last_name', 
            'profile_picture_avatar')

class WorkoutSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = (
            'id', 'heart_avg', 
            'workout_type', 'session_duration', 'water_intake', 
            'calories_burned', 'created_at'
        )
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'content', 'created_at']

class AttachmentSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = Attachment
        fields = ['file', 'file_name', 'file_type']

    def get_file(self, obj):
        if obj.file:
            return base64.b64encode(obj.file).decode('utf-8')
        return None

class PostSerializer(serializers.ModelSerializer):
    user = userDTO(read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'created_at', 'likes_count', 'comments_count', 'attachments']
        read_only_fields = ['user', 'likes_count', 'comments_count']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)        
