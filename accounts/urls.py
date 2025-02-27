from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from django.urls import path
from . import views


# accounts/urls.py
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'accounts'

urlpatterns = [
    path('',
        auth_views.LoginView.as_view(template_name='login_index.html'),
        name='login'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('signup_success/', views.SignUpSuccessView.as_view(), name='signup_success'),
    path('logout/', auth_views.LogoutView.as_view(template_name='logout.html'), name='logout'),
]
