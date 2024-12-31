from django.urls import path
from .views import translate_text  # Import your view here

urlpatterns = [
    path('api/translate/', translate_text, name='translate_text'),
]
