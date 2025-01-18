GlobalVoice: Real-Time Language Translator
---------------------

GlobalVoice is a cutting-edge web application that facilitates real-time language translation through both text and speech inputs. Leveraging advanced NLP and machine learning technologies, the application provides an intuitive and seamless interface for multilingual communication. It is designed to be highly interactive and user-friendly, making it ideal for personal and professional use.


Features
---------------------

•	Text Translation: Translate text between multiple languages with ease.

•	Speech Translation: Capture speech input, translate it to the desired language, and play back the translated audio.

•	Language Detection: Automatically detect the source language if unspecified.

•	Real-Time Results: Immediate text and speech translation for smooth communication.

•	Dynamic Language Support: Support for popular languages, including English, Spanish, French, German, Chinese, Hindi, and more.

•	Speech-to-Text and Text-to-Speech Integration: Use speech recognition to input text and convert translated text to speech output.

•	Error Handling: Graceful handling of network and translation errors with user-friendly messages.

•	Responsive Design: Optimized for both desktop and mobile devices.


Technologies Used
---------------------

•	Backend: Django, Django REST Framework, Google Translator API, Google Text-to-Speech (gTTS), SpeechRecognition

•	Frontend: React, Axios

•	Audio Processing: gTTS for speech synthesis

•	Speech Recognition: Google Web Speech API

•	Database: SQLite (can be switched to PostgreSQL or other databases for production)


Setup Instructions
---------------------

Prerequisites
---------------------

Ensure you have the following installed on your system:

•	Python (3.x)

•	Node.js (for React frontend)

•	npm (for managing frontend packages)

•	SQLite (or another preferred database)


Backend Setup
---------------------

1.	Clone the repository:

git clone https://github.com/Suraj-Sedai/GlobalVoice-Real-Time-Language-Translator

2.	Navigate to the backend directory:

cd backend/

3.	Create a virtual environment (optional but recommended):

4.	python -m venv venv

source venv/bin/activate  # On Windows, use venv\Scripts\activate

5.	Install the required Python packages:

pip install -r requirements.txt

6.	Apply migrations to set up the database:

python manage.py migrate

7.	Start the backend server:

python manage.py runserver


Frontend Setup
---------------------

1.	Navigate to the frontend directory:

cd frontend/

2.	Install the required frontend packages:

npm install

3.	Start the frontend development server:

npm start


Configuration
---------------------

•	Update the API base URL in the frontend code (e.g., frontend/src/api.js) to point to the backend server if not running locally.

•	Ensure the backend server is running before testing the application.


API Endpoints
---------------------

•	POST /api/translate/: Translate text between the source and target languages.

•	POST /api/speech-to-speech-translate/: Translate speech input and return the translated audio.



Frontend Details
---------------------

•	Tab Selector: Switch between text and speech translation modes.

•	Text Translator: Enter text to translate and view results instantly.

•	Speech Translator: Speak into the microphone to translate and play back the audio.

•	Language Selection: Dropdown menus for selecting source and target languages.

•	Error Messages: Inform users of network or translation errors.

•	Responsive UI: Supports both mobile and desktop views.


Error Handling
---------------------

•	Provides meaningful error messages for network failures or unsupported operations.

•	Ensures smooth fallback in case of speech recognition or translation errors.


Future Improvements
---------------------

•	Enhanced Speech Recognition: Support for continuous speech recognition.

•	Offline Mode: Add offline translation capabilities.

•	Expanded Language Support: Increase the range of supported languages.

•	User Profiles: Enable user-specific settings and preferences.

•	Cloud Deployment: Host the application on a cloud platform for scalability.



