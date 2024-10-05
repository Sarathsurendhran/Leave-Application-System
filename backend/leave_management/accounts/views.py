# accounts/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# class LoginView(generics.GenericAPIView):
#     serializer_class = LoginSerializer
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         email = serializer.validated_data['email']
#         password = serializer.validated_data['password']

#         user = authenticate(request, email=email, password=password)

#         if user is not None:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }, status=status.HTTP_200_OK)
#         else:
#             return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, email=email, password=password)  # Use 'username'

        if user is not None:
            refresh = RefreshToken.for_user(user)
            refresh["user_id"] = user.id
            refresh["first_name"] = user.first_name
            refresh["last_name"] = user.last_name
            refresh["email"] = user.email
            refresh["isAuthenticated"] = user.is_authenticated
            refresh["is_manager"] = user.is_manager
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({
                'refresh': refresh_token,
                'access': access_token,
                'user_id': user.id,  # Include user ID
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_manager': user.is_manager,
                
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_manager': user.is_manager,
        }
        return Response(data)
