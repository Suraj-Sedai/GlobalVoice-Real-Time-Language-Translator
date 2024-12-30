from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import tensorflow as tf
from transformers import pipeline

@api_view(['POST'])
def translate(request):
    input_text = request.data.get('input_text')
    target_language = request.data.get('target_language')

    print(f"Received input_text: {input_text}, target_language: {target_language}")

    if not input_text or not target_language:
        return Response({"error": "Missing input_text or target_language"}, status=status.HTTP_400_BAD_REQUEST)

    # Simulate translation (you will replace this with actual translation logic later)
    translator = pipeline("translation_en_to_fr", model="t5-small")
    print(translator(input_text))

    convert = (translator(input_text))
    
    translated_text = f"{convert} (Translated to {target_language})"
    print(f"Translated text: {translated_text}")

    return Response({"translated_text": translated_text})

