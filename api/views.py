from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Member, AuthToken, ChatMessage
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    MemberSerializer,
    ChatMessageSerializer,
    ChatMessageCreateSerializer,
)

COOKIE_NAME = "auth_token"
COOKIE_KWARGS = {"httponly": True, "samesite": "Lax", "secure": False}


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        token = AuthToken.for_member(member)
        payload = {"token": token.key, "member": MemberSerializer(member).data}
        resp = Response(payload, status=status.HTTP_201_CREATED)
        resp.set_cookie(COOKIE_NAME, token.key, **COOKIE_KWARGS)
        return resp


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        try:
            member = Member.objects.get(username=username)
        except Member.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        if not member.check_password(password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        token = AuthToken.for_member(member)
        payload = {"token": token.key, "member": MemberSerializer(member).data}
        resp = Response(payload, status=status.HTTP_200_OK)
        resp.set_cookie(COOKIE_NAME, token.key, **COOKIE_KWARGS)
        return resp


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # delete token and cookie
        try:
            if hasattr(request.user, "auth_token"):
                request.user.auth_token.delete()
        except Exception:
            pass
        resp = Response({"success": True})
        resp.delete_cookie(COOKIE_NAME)
        return resp


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(MemberSerializer(request.user).data)


class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = ChatMessage.objects.select_related("author").order_by("created_at")
        return Response(ChatMessageSerializer(qs, many=True).data)

    def post(self, request):
        serializer = ChatMessageCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        content = serializer.validated_data["content"].strip()
        if not content:
            return Response({"detail": "Message cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
        msg = ChatMessage.objects.create(author=request.user, content=content)
        return Response(ChatMessageSerializer(msg).data, status=status.HTTP_201_CREATED)


class UsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usernames = list(Member.objects.order_by("username").values_list("username", flat=True))
        return Response({"usernames": usernames})
