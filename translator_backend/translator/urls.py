from django.urls import path
from .views import translate  # Import your view here

urlpatterns = [
    path('api/translate/', translate, name='translate_text'),
]
