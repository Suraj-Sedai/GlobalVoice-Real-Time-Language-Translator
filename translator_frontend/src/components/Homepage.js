import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("auto"); // Default is auto detect
    const [targetLanguage, setTargetLanguage] = useState("es"); // Default to Spanish
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("text"); // "text" or "speech"
    const [isRecording, setIsRecording] = useState(false);

    // Available languages with full names
    const source_languages = [
        { code: "auto", name: "Auto Detect" },
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "zh", name: "Chinese" },
        { code: "hi", name: "Hindi" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
    ];

    const target_languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "it", name: "Italian" },
        { code: "zh", name: "Chinese" },
        { code: "hi", name: "Hindi" },
        { code: "ja", name: "Japanese" },
        { code: "ko", name: "Korean" },
    ];

    const handleTranslate = async () => {
        setIsLoading(true);
        setErrorMessage("");
        setTranslatedText("");

        try {
            const response = await axios.post("http://localhost:8000/api/translate/", {
                input_text: inputText,
                source_language: sourceLanguage,
                target_language: targetLanguage,
            });
            setTranslatedText(response.data.translated_text);
        } catch (error) {
            console.error("Error translating text:", error.response || error);
            setErrorMessage("Error translating text. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    const startRecording = () => {
        setIsRecording(true);
        setErrorMessage("");
        setTranslatedText("");
    
        // Check if SpeechRecognition is supported by the browser
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setErrorMessage("Speech Recognition is not supported by this browser.");
            return;
        }
    
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
    
        recognition.onresult = async (event) => {
            const transcript = event.results[event.resultIndex][0].transcript;
            console.log("Recognized speech:", transcript);
            setInputText(transcript);
        };
    
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setErrorMessage("Speech recognition error. Please try again.");
        };
    
        recognition.start();
    };
    
    const stopRecording = async () => {
        setIsRecording(false);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.stop();
    
        // Ensure that the text is sent to the backend for translation
        if (inputText.trim() === "") {
            setErrorMessage("No speech input detected. Please speak again.");
            return;
        }
    
        try {
            setIsLoading(true);
            setErrorMessage("");
    
            const response = await axios.post("http://localhost:8000/api/translate/", {
                input_text: inputText,
                source_language: sourceLanguage,
                target_language: targetLanguage,
            });
    
            setTranslatedText(response.data.translated_text);
        } catch (error) {
            console.error("Error translating speech:", error.response || error);
            setErrorMessage("Error translating speech. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    
    const handleSpeechTranslate = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
    
            // Initialize SpeechRecognition API
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = sourceLanguage;  // Set the language for recognition
            recognition.interimResults = false;  // We want final results only
            recognition.maxAlternatives = 1;  // Capture only the first result
    
            // Start listening
            recognition.start();
    
            // Capture the result when speech is recognized
            recognition.onresult = async (event) => {
                const speechText = event.results[0][0].transcript;  // Get the recognized text
                console.log("Recognized Speech:", speechText);  // Log recognized text
    
                // Send the captured text for translation
                const response = await axios.post("http://localhost:8000/api/speech_to_speech_translate/", {
                    input_text: speechText,  // Add recognized speech text
                    target_language: targetLanguage,  // User-selected target language
                    sourceLanguage: sourceLanguage,  // User-selected source language
                });
    
                // Handle the translated text
                const translatedText = response.data.translated_text;
                setTranslatedText(translatedText);
    
                // Convert translated text to speech
                const speech = new SpeechSynthesisUtterance(translatedText);
                window.speechSynthesis.speak(speech);
            };
    
            // Handle errors
            recognition.onerror = (event) => {
                setErrorMessage("Speech recognition failed. Please try again.");
                setIsLoading(false);
            };
    
        } catch (error) {
            console.error("Error in speech-to-speech translation:", error);
            setErrorMessage("Error in speech translation. Please try again.");
            setIsLoading(false);
        }
    };
    
    

    return (
        <div className="home-container">
            {/* Navigation between tabs */}
            <div className="tab-selector">
                <button
                    className={`tab-button ${activeTab === "text" ? "active" : ""}`}
                    onClick={() => setActiveTab("text")}
                >
                    Text Translator
                </button>
                <button
                    className={`tab-button ${activeTab === "speech" ? "active" : ""}`}
                    onClick={() => setActiveTab("speech")}
                >
                    Speech Translator
                </button>
            </div>

            {/* Conditional Rendering of Content */}
            {activeTab === "text" ? (
                <div className="text-tab">
                    <h1>Text Translator</h1>
                    <p className="subtitle">Translate from one language to another seamlessly</p>
                    <div className="form-group">
                        <textarea
                            className="text_area"
                            placeholder="Enter text to translate..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sourceLanguage">From:</label>
                        <select
                            className="select"
                            id="sourceLanguage"
                            value={sourceLanguage}
                            onChange={(e) => setSourceLanguage(e.target.value)}
                        >
                            {source_languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="targetLanguage">To:</label>
                        <select
                            className="select"
                            id="targetLanguage"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                            {target_languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleTranslate} disabled={isLoading}>
                        {isLoading ? "Translating..." : "Translate"}
                    </button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {translatedText && (
                        <div className="translated-text">
                            <h2>Translated Text:</h2>
                            <p>{translatedText}</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="speech-tab">
                    <h1>Speech-to-Speech Translator</h1>
                    <p className="subtitle">Speak in one language and hear the translation</p>
                    <button
                        className="record-btn"
                        onClick={isRecording ? stopRecording : startRecording}
                    >
                        {isRecording ? "Stop Speaking" : "🎤 Start Speaking"}
                    </button>
                    <div className="form-group">
                        <label htmlFor="sourceLanguage">From:</label>
                        <select
                            className="select"
                            id="sourceLanguage"
                            value={sourceLanguage}
                            onChange={(e) => setSourceLanguage(e.target.value)}
                        >
                            {source_languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="targetLanguage">To:</label>
                        <select
                            className="select"
                            id="targetLanguage"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                            {target_languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <button onClick={handleSpeechTranslate} disabled={isLoading}>
                        {isLoading ? "Translating..." : "Translate"}
                    </button> */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {translatedText && (
                        <div className="translated-text">
                            <h2>Translated Text:</h2>
                            <p>{translatedText}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;
