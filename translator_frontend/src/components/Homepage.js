import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("Auto detect");
    const [targetLanguage, setTargetLanguage] = useState("Spanish");
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("text"); // "text" or "speech"
    const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(true);

    const source_languages = ["Auto detect", "English", "Spanish", "French", "Chinese", "Hindi", "Italian", "German", "Nepali"];
    const target_languages = ["English", "Spanish", "French", "Chinese", "Hindi", "Italian", "German", "Nepali"];

    // Text Translation
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

    const handleSpeechTranslation = async () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechRecognitionAvailable(false);
            setErrorMessage("Speech recognition is not supported in this browser.");
            return;
        }
    
        const recognition = new SpeechRecognition();
        recognition.lang = sourceLanguage === "Auto detect" ? "en-US" : sourceLanguage;
        recognition.interimResults = false;
    
        recognition.onstart = () => {
            setErrorMessage("");
            console.log("Speech recognition started...");
        };
    
        recognition.onresult = async (event) => {
            const recognizedSpeech = event.results[0][0].transcript;
            console.log("Recognized Speech:", recognizedSpeech);
    
            try {
                setIsLoading(true);
                const response = await axios.post("http://localhost:8000/api/speech_to_speech_translate/", {
                    input_text: recognizedSpeech,
                    target_language: targetLanguage,
                    source_language: sourceLanguage,
                });
                setTranslatedText(response.data.translated_text);
    
                // Optional: Play translated output
                const utterance = new SpeechSynthesisUtterance(response.data.translated_text);
                utterance.lang = targetLanguage;
                speechSynthesis.speak(utterance);
            } catch (error) {
                console.error("Error in speech translation:", error.response || error);
                setErrorMessage("Error in speech translation. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
    
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setErrorMessage(`Speech recognition error: ${event.error}`);
        };
    
        recognition.start();
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
                                <option key={lang} value={lang}>
                                    {lang}
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
                                <option key={lang} value={lang}>
                                    {lang}
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
                        onClick={handleSpeechTranslation}
                        className="record-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Listening..." : "🎤 Start Speaking"}
                    </button>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {translatedText && (
                        <div className="translated-text">
                            <h2>Translated Output:</h2>
                            <p>{translatedText}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;
