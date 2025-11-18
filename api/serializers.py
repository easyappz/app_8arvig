from rest_framework import serializers
from .models import Member, ChatMessage


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["id", "username"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=6)

    def validate_username(self, value):
        if Member.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken")
        return value

    def create(self, validated_data):
        member = Member(username=validated_data["username"])
        member.set_password(validated_data["password"])
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(min_length=1)


class ChatMessageSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ["id", "author_username", "content", "created_at"]

    def get_author_username(self, obj):
        return obj.author.username


class ChatMessageCreateSerializer(serializers.Serializer):
    content = serializers.CharField(allow_blank=False, allow_null=False)
