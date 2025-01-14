from gtts import gTTS
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from googletrans import Translator, LANGUAGES
import speech_recognition as sr
import pyttsx3

# Speech-to-Text Function
def speech_to_text():
    """
    Converts speech input from the microphone to text using Google Speech Recognition.
    """
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Please speak something...")
        recognizer.adjust_for_ambient_noise(source)  # Adjust for background noise
        audio = recognizer.listen(source)

    try:
        # Recognize speech using Google Web Speech API
        text = recognizer.recognize_google(audio)
        print(f"You said: {text}")
        return {"success": True, "text": text}
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
        return {"success": False, "error": "Could not understand the audio."}
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return {"success": False, "error": f"Request error: {e}"}

# API Endpoint for Speech-to-Speech Translation

@api_view(['POST'])
def speech_to_speech_translate(request):
    """
    Handles speech-to-speech translation. Captures audio input, converts to text, translates, and returns translated speech.
    """
    target_language = request.data.get('target_language', 'en')  # Default to English
    source_language = request.data.get('source_language', 'auto')  # Default to auto-detect

    # Validate if the languages are valid
    if source_language not in LANGUAGES.keys():
        return Response({"error": "Invalid source language"}, status=status.HTTP_400_BAD_REQUEST)
    
    if target_language not in LANGUAGES.keys():
        return Response({"error": "Invalid target language"}, status=status.HTTP_400_BAD_REQUEST)

    # Step 1: Convert Speech to Text
    try:
        speech_result = speech_to_text()  # Replace with your speech-to-text function
        if not speech_result["success"]:
            return Response({"error": speech_result["error"]}, status=status.HTTP_400_BAD_REQUEST)
        input_text = speech_result["text"]
        print(f"Recognized Speech: {input_text}")
    except Exception as e:
        return Response({"error": f"Speech recognition failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Step 2: Translate Text
    try:
        translator = Translator()
        result = translator.translate(input_text, src=source_language, dest=target_language)
        translated_text = result.text
        print(f"Translated Text: {translated_text}")
    except Exception as e:
        return Response({"error": f"Translation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Step 3: Convert Translated Text to Speech
    try:
        # Using gTTS to generate speech
        tts = gTTS(text=translated_text, lang=target_language, slow=False)
        audio_file = "media/translated_speech.mp3"
        tts.save(audio_file)

        # Ensure the media directory exists
        if not os.path.exists("media"):
            os.makedirs("media")

        return Response({
            "translated_text": translated_text,
            "audio_url": f"http://localhost:8000/{audio_file}"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error during speech synthesis: {e}")
        return Response({"error": "Speech generation failed. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# API Endpoint for Translation
@api_view(['POST'])
def translate(request):
    """
    Handles translation requests. Expects input_text, source_language, and target_language in the request body.
    """
    input_text = request.data.get('input_text')
    source_language = request.data.get('sourceLanguage', 'auto')  # Default to 'auto'
    target_language = request.data.get('target_language')

    # Validate inputs
    if not input_text:
        return Response({"error": "Missing input_text"}, status=status.HTTP_400_BAD_REQUEST)
    if not target_language:
        return Response({"error": "Missing target_language"}, status=status.HTTP_400_BAD_REQUEST)

    print(f"Input Text: {input_text}, Source Language: {source_language}, Target Language: {target_language}")

    try:
        translator = Translator()
        result = translator.translate(input_text, src=source_language, dest=target_language)
        return Response({"translated_text": result.text}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error during translation: {e}")
        return Response({"error": "Translation failed. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)