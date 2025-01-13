from django.urls import path
from .views import translate  # Import your view here
from .views import speech_to_speech_translate
urlpatterns = [
    path('api/translate/', translate, name='translate_text'),
    path('api/speech_to_speech_translate/', speech_to_speech_translate, name='speech_to_speech_translate'),  # Add this line

]
