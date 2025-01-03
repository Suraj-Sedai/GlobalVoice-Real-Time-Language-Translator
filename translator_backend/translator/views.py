from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from transformers import pipeline

# Load translation pipelines
pipelines = {
    "chinese": pipeline("translation_en_to_zh", model="Helsinki-NLP/opus-mt-en-zh"),
    "french": pipeline("translation_en_to_fr", model="Helsinki-NLP/opus-mt-en-fr"),
    # Add more language mappings here as needed
}

@api_view(['POST'])
def translate(request):
    input_text = request.data.get('input_text')
    target_language = request.data.get('target_language')
    print(f"Received input_text: {input_text}, target_language: {target_language}")

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
        print(f"Translated text: {translated_text}")
        return Response({"translated_text": translated_text})
    except Exception as e:
        print(f"Error during translation: {e}")
        return Response({"error": "Translation failed. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
