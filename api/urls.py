from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ProfileView, ChatMessagesView, UsersListView

urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("logout", LogoutView.as_view(), name="logout"),
    path("profile", ProfileView.as_view(), name="profile"),
    path("chat/messages", ChatMessagesView.as_view(), name="chat-messages"),
    path("chat/users", UsersListView.as_view(), name="chat-users"),
]
