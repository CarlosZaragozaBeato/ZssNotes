from django.urls import path
from . import views

app_name = 'app'  # This defines the namespace

urlpatterns = [
    path('', views.index, name='index'),
    path('library/', views.library, name="library"),
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout, name='logout'),
]
