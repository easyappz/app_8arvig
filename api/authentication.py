from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from typing import Optional, Tuple
from .models import AuthToken


class CookieTokenAuthentication(BaseAuthentication):
    keyword = b"Token"

    def authenticate(self, request) -> Optional[Tuple[object, None]]:
        # Try Authorization: Token <key>
        auth = get_authorization_header(request).split()
        token_value = None
        if auth and auth[0].lower() == self.keyword.lower() and len(auth) == 2:
            token_value = auth[1].decode()

        # Fallback to httpOnly cookie
        if not token_value:
            token_value = request.COOKIES.get("auth_token")
        if not token_value:
            return None

        try:
            token_obj = AuthToken.objects.select_related("member").get(key=token_value)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        return (token_obj.member, None)
