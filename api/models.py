from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
import secrets


class Member(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # hashed
    created_at = models.DateTimeField(default=timezone.now)

    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    @property
    def is_authenticated(self) -> bool:  # for DRF IsAuthenticated compatibility
        return True

    def __str__(self) -> str:
        return self.username


class AuthToken(models.Model):
    key = models.CharField(max_length=40, unique=True)
    member = models.OneToOneField(Member, on_delete=models.CASCADE, related_name='auth_token')
    created_at = models.DateTimeField(default=timezone.now)

    @staticmethod
    def generate_key() -> str:
        return secrets.token_hex(20)

    @classmethod
    def for_member(cls, member: Member) -> "AuthToken":
        token, created = cls.objects.get_or_create(member=member, defaults={"key": cls.generate_key()})
        if not created:
            token.key = cls.generate_key()
            token.created_at = timezone.now()
            token.save(update_fields=["key", "created_at"])
        return token


class ChatMessage(models.Model):
    author = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["created_at"]
