from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('api/index/', views.api_index, name='index'),
]
