import os
from django.conf import settings
from django.shortcuts import render
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import User, WorkoutSession, Post, Comment, Attachment, PostLike
from .serializers import UserSerializer, WorkoutSessionSerializer, PostSerializer, CommentSerializer, AttachmentSerializer
import pickle
from django.db.models import Sum, Avg
import math as m
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.http import FileResponse, HttpResponse
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from PIL import Image
import io
import logging
from rest_framework.pagination import PageNumberPagination
import base64
model_path = os.path.join(settings.BASE_DIR, 'AI_model', 'model.pkl')
logger = logging.getLogger(__name__)

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            })
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, 
                       status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculate_calories(request):
    print(request.data)
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        session_data = request.data.get('session', {})
        
        # Extract user ID from session data
        user = session_data.get('id')
        try:
            user = User.objects.get(id=user)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, 
                          status=status.HTTP_404_NOT_FOUND)

        workout_data = {
            "Session_Duration": float(session_data['Session_Duration']),
            "Session_Duration_Workout_Frequency": float(session_data['Session_Duration']) * int(session_data['Workout_Frequency']),
            "Avg_BPM": int(session_data['Avg_BPM']),
            "Age": int(session_data['Age']),
            "Gender": session_data['Gender'],
            "Fat_Percentage": float(session_data['Fat_Percentage'])
        }

        feature_order = [
            "Session_Duration",
            "Session_Duration_Workout_Frequency",
            "Avg_BPM",
            "Fat_Percentage",
            "Age",
            "Gender"
        ]

        final_data = pd.DataFrame([workout_data], columns=feature_order)
        calories_burned = model.predict(final_data)[0]

        # Save workout session
        workout_session = WorkoutSession.objects.create(
            user=user,
            heart_avg=session_data['Avg_BPM'],
            workout_type=session_data['Workout_Type'],
            session_duration=session_data['Session_Duration'],
            water_intake=session_data['Water_Intake'],
            calories_burned=calories_burned
        )

        # Serialize the workout session
        serializer = WorkoutSessionSerializer(workout_session)
        
        return Response({
            'calories_burned': calories_burned
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_statistics(request, user_id):
    
    if not request.auth:
        return Response(
            {'error': 'No authentication token provided'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    try:
        user = User.objects.get(id=user_id)
        if request.user != user:
            return Response(
                {'error': 'Not authorized to view this user\'s statistics'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        workouts = WorkoutSession.objects.filter(user=user).order_by('created_at')[:20]
        
        # Calculate summary statistics
        summary = {
            'total_workouts': workouts.count(),
            'total_calories': workouts.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            'avg_duration': workouts.aggregate(Avg('session_duration'))['session_duration__avg'] or 0,
            'avg_heart_rate': workouts.aggregate(Avg('heart_avg'))['heart_avg__avg'] or 0,
        }
        
        # Prepare chart data
        calorie_burn = [
            {
                'date': workout.created_at.strftime('%Y-%m-%d'),
                'calories_burned': round(workout.calories_burned,4)
            } for workout in workouts
        ]
        
        duration_water = [
            {
                'date': workout.created_at.strftime('%Y-%m-%d'),
                'duration': round(workout.session_duration,4),
                'water': round(workout.water_intake,4)
            } for workout in workouts
        ]
        
        # Count workout types
        workout_types = {}
        for workout in workouts:
            workout_types[workout.workout_type] = workout_types.get(workout.workout_type, 0) + 1
            
        workout_counts = [
            {'workout_type': wtype, 'count': count}
            for wtype, count in workout_types.items()
        ]
        
        response_data = {
            'summary': summary,
            'recent_workouts': WorkoutSessionSerializer(workouts, many=True).data,
            'chart_data': {
                'calorie_burn': calorie_burn,
                'duration_water': duration_water,
                'workout_counts': workout_counts
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class PostPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)
    pagination_class = PostPagination
    
    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at')
        user_id = self.request.query_params.get('user', None)
        
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        elif self.action == 'list' and self.request.path.startswith('/api/posts/'):
            # Filter out current user's posts for the main feed
            queryset = queryset.exclude(user=self.request.user)
            
        return queryset
    
    def perform_create(self, serializer):
        post = serializer.save()
        if 'file' in self.request.FILES:
            file_obj = self.request.FILES['file']
            Attachment.objects.create(
                post=post,
                file=file_obj.read(),
                file_name=file_obj.name,
                file_type=file_obj.content_type
            )

    @action(detail=True, methods=['post', 'delete'])
    def like(self, request, pk=None):
        post = self.get_object()
        like_exists = post.likes.filter(user=request.user).exists()

        if request.method == 'POST' and not like_exists:
            PostLike.objects.create(post=post, user=request.user)
            return Response({'status': 'post liked'})
        elif request.method == 'DELETE' and like_exists:
            post.likes.filter(user=request.user).delete()
            return Response({'status': 'post unliked'})
        
        return Response({'status': 'no action taken'}, status=400)

    @action(detail=True, methods=['get'])
    def attachments(self, request, pk=None):
        post = self.get_object()
        attachments = post.attachments.all()
        serializer = AttachmentSerializer(attachments, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def perform_create(self, serializer):
        file_obj = self.request.FILES['file']
        file_content = file_obj.read()
        serializer.save(
            file=file_content,
            file_name=file_obj.name,
            file_type=file_obj.content_type
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_picture(request):
    try:
        user = request.user
        if 'profile_picture' in request.FILES:
            file = request.FILES['profile_picture']
            logger.info(f"Received file: {file.name}, size: {file.size} bytes")
            
            user.profile_picture = file.read()
            user.profile_picture_type = file.content_type

            try:
                image = Image.open(file)
                avatar_size = (image.width // 3, image.height // 3)  
                image.thumbnail(avatar_size)
                avatar_io = io.BytesIO()
                image.save(avatar_io, format='JPEG')
                avatar_io.seek(0)  
                
                user.profile_picture_avatar = avatar_io.read() 
                logger.info(f"Avatar created with size: {avatar_io.getbuffer().nbytes} bytes")
            except Exception as img_error:
                logger.error(f"Error processing image: {img_error}")
                return Response({'error': 'Invalid image file'}, status=400)
            
            user.save()
            return Response({'message': 'Profile picture updated successfully'})
        return Response({'error': 'No file provided'}, status=400)
    except Exception as e:
        logger.error(f"Error updating profile picture: {e}")
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_picture(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if user.profile_picture:
            return HttpResponse(
                user.profile_picture,
                content_type=user.profile_picture_type
            )
        return Response({'error': 'No profile picture found'}, status=404)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_picture_avatar(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if user.profile_picture:
            return HttpResponse(
                user.profile_picture_avatar,
                content_type=user.profile_picture_type
            )
        return Response({'error': 'No profile picture found'}, status=404)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
        
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_picture(request,user_id):
    try:
         user = User.objects.get(id=user_id)
         if(user.profile_picture):
             user.profile_picture=None
             user.profile_picture_type=None
             user.profile_picture_avatar = None
             user.save()
             return Response({'message':'Deletion successffull'},status=200)
    except User.DoesNotExist:
        return Response({'error':'user does no exist'},status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_people(request):
    users = User.objects.exclude(id=request.user.id)
    users = users.order_by('?')[:5]
    
    data = []
    for user in users:
        user_data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'biography': user.biography,
            'profile_picture_avatar': None,
            'profile_picture_type': user.profile_picture_type,
            'is_following': request.user.following.filter(id=user.id).exists()
        }
        
        if user.profile_picture_avatar:
            user_data['profile_picture_avatar'] = base64.b64encode(user.profile_picture_avatar).decode('utf-8')
        
        data.append(user_data)
    
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    try:
        user_to_follow = User.objects.get(id=user_id)
        request.user.following.add(user_to_follow)
        
        # Update counts
        request.user.following_count = request.user.following.count()
        user_to_follow.followers_count = user_to_follow.followers.count()
        
        request.user.save()
        user_to_follow.save()
        
        return Response({
            'status': 'success',
            'following_count': request.user.following_count,
            'followers_count': user_to_follow.followers_count
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, user_id):
    try:
        user_to_unfollow = User.objects.get(id=user_id)
        request.user.following.remove(user_to_unfollow)
        
        # Update counts
        request.user.following_count = request.user.following.count()
        user_to_unfollow.followers_count = user_to_unfollow.followers.count()
        
        request.user.save()
        user_to_unfollow.save()
        
        return Response({
            'status': 'success',
            'following_count': request.user.following_count,
            'followers_count': user_to_unfollow.followers_count
        })
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_feed(request):
    # Get posts from users that the current user follows
    following_users = request.user.following.all()
    posts = Post.objects.filter(user__in=following_users).order_by('-created_at')
    
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(result_page, many=True)
    
    return paginator.get_paginated_response(serializer.data)