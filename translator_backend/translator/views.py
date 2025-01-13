from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# from transformers import pipeline
from googletrans import Translator

 
# # Load translation pipelines for different languages
# pipelines = {
#     "chinese": pipeline("translation_en_to_zh", model="Helsinki-NLP/opus-mt-en-zh"),
#     "french": pipeline("translation_en_to_fr", model="Helsinki-NLP/opus-mt-en-fr"), 
#     "spanish": pipeline("translation_es_to_en", model="Helsinki-NLP/opus-mt-es-en"),
#     "hindi": pipeline("translation_en_to_hi", model="Helsinki-NLP/opus-mt-en-hi"),
#     "italian": pipeline("translation_en_to_it", model="Helsinki-NLP/opus-mt-en-it"),
#     "german": pipeline("translation_en_to_de", model="Helsinki-NLP/opus-mt-en-de"),
# }
@api_view(['POST'])
def translate(request):
    """
    Handles translation requests. Expects input_text, source_language, and target_language in the request body.
    """
    # Get input_text, source_language, and target_language from the request data
    input_text = request.data.get('input_text')
    source_language = request.data.get('sourceLanguage')
    target_language = request.data.get('target_language')

    # Validate inputs
    if not input_text:
        return Response({"error": "Missing input_text"}, status=status.HTTP_400_BAD_REQUEST)
    if not target_language:
        return Response({"error": "Missing target_language"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Default source_language to 'auto' if not provided
    source_language = source_language or 'auto'

    # Log input values
    print(f"Input Text: {input_text}, Source Language: {source_language}, Target Language: {target_language}")

    try:
        # Initialize the translator
        translator = Translator()

        # Perform the translation
        result = translator.translate(input_text, src=source_language, dest=target_language)

        # Return the translated text as part of the response
        return Response({"translated_text": result.text}, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Log error and return a response with a generic error message
        print(f"Error during translation: {e}")
        return Response({"error": "Translation failed. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
