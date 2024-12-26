import os
from django.conf import settings
from django.shortcuts import render
import pandas as pd
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import User, WorkoutSession, Post, Comment, Attachment
from .serializers import UserSerializer, WorkoutSessionSerializer, PostSerializer, CommentSerializer, AttachmentSerializer
import pickle
from django.db.models import Sum, Avg
import math as m
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.http import FileResponse
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action

model_path = os.path.join(settings.BASE_DIR, 'AI_model', 'model.pkl')

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
            "Avg_BPM": int(session_data['Avg_BPM']),
            "Age": int(session_data['Age']),
            "Gender": session_data['Gender'],
            "Fat_Percentage": float(session_data['Fat_Percentage'])
        }

        feature_order = [
            "Session_Duration", 
            "Avg_BPM",
            "Age",
            "Gender",
            "Fat_Percentage"
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
    
    
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_pfp(request, user_id):
#     try:
#         user = User.objects.get(id=user_id)
#         if user.profile_picture:
#             file_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_picture))
#             if os.path.exists(file_path):
#                 return FileResponse(open(file_path, 'rb'), content_type='image/*')
#     except Exception as e:
#         return HttpResponse(status=404)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)
    
    def perform_create(self, serializer):
        post = serializer.save(user=self.request.user)
        if 'file' in self.request.FILES:
            file_obj = self.request.FILES['file']
            Attachment.objects.create(
                post=post,
                file=file_obj.read(),
                file_name=file_obj.name,
                file_type=file_obj.content_type
            )

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes_count += 1
        post.save()
        return Response({'status': 'post liked'})

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
            user.profile_picture = file.read()
            user.profile_picture_type = file.content_type
            user.save()
            return Response({'message': 'Profile picture updated successfully'})
        return Response({'error': 'No file provided'}, status=400)
    except Exception as e:
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

