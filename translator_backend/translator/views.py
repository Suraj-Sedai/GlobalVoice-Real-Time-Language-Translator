from rest_framework.decorators import api_view
from rest_framework.response import Response
from transformers import pipeline

@api_view(['POST'])
def translate_text(request):
    input_text = request.data.get('input_text', '')
    target_language = request.data.get('target_language', '')

    if not input_text or not target_language:
        return Response({'error': 'Input text and target language are required'}, status=400)

    try:
        if target_language.lower() == "french":
            translator = pipeline("translation_en_to_fr", model="t5-small")
        else:
            return Response({'error': f'Translation to {target_language} is not supported'}, status=400)

        result = translator(input_text)
        translated_text = result[0]['translation_text']
        return Response({'translated_text': translated_text})
    except Exception as e:
        print("Translation error:", str(e))
        return Response({'error': 'Translation failed. Please check the backend setup.'}, status=500)
