from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from transformers import pipeline

# Load translation pipelines for different languages
pipelines = {
    "chinese": pipeline("translation_en_to_zh", model="Helsinki-NLP/opus-mt-en-zh"),
    "french": pipeline("translation_en_to_fr", model="Helsinki-NLP/opus-mt-en-fr"), 
    "spanish": pipeline("translation_en_to_es", model="Helsinki-NLP/opus-mt-en-es"),
    "hindi": pipeline("translation_en_to_hi", model="Helsinki-NLP/opus-mt-en-hi"),
    "italian": pipeline("translation_en_to_it", model="Helsinki-NLP/opus-mt-en-it"),
    "german": pipeline("translation_en_to_de", model="Helsinki-NLP/opus-mt-en-de"),
}

@api_view(['POST'])
def translate(request):
    """
    Handles translation requests. Expects input_text and target_language in the request body.
    """
    # Get input_text and target_language from the request data
    input_text = request.data.get('input_text')
    target_language = request.data.get('target_language')

    # Check for missing input_text or target_language
    if not input_text or not target_language:
        return Response({"error": "Missing input_text or target_language"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if target language is supported
    translator = pipelines.get(target_language.lower())
    if not translator:
        return Response({"error": f"Unsupported target language: {target_language}"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Perform translation
        translation = translator(input_text)
        translated_text = translation[0]['translation_text']
        return Response({"translated_text": translated_text}, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Log error and return a response with a generic error message
        print(f"Error during translation: {e}")
        return Response({"error": "Translation failed. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
