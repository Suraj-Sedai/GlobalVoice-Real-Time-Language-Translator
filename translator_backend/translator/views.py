from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from transformers import pipeline

import openai

# Set up API key
openai.api_key = "your_openai_api_key"

def translate_text(input_text, target_language):
    prompt = f"Translate the following text into {target_language}: {input_text}"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response['choices'][0]['message']['content']

@api_view(['POST'])
def translate(request):
    input_text = request.data.get('input_text')
    target_language = request.data.get('target_language')
    print(f"Received input_text: {input_text}, target_language: {target_language}")
    translation = translate_text(input_text, target_language)
    translated_text = translation[0]['translation_text']

    print(f"Translated text: {translated_text}")
    return Response({"translated_text": translated_text})


    # try:
    #     # Perform translation
    #     translation = translate_text(input_text, target_language)
    #     translated_text = translation[0]['translation_text']
    #     print(f"Translated text: {translated_text}")
    #     return Response({"translated_text": translated_text})
    # except Exception as e:
    #     print(f"Error during translation: {e}")
    #     return Response({"error": "Translation failed. Please try again."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


