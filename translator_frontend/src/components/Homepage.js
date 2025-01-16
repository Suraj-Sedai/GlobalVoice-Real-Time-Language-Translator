import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("auto"); // Default is auto-detect
    const [targetLanguage, setTargetLanguage] = useState("es"); // Default to Spanish
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("text"); // "text" or "speech"
    const [isRecording, setIsRecording] = useState(false);

    // Available languages with full names
    const languages = [
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
            speakText(response.data.translated_text); // Speak the translated text
        } catch (error) {
            console.error("Error translating text:", error.response || error);
            setErrorMessage("Error translating text. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const speakText = (text) => {
        if ("speechSynthesis" in window) {
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = targetLanguage; // Set language for speech synthesis
            window.speechSynthesis.speak(speech);
        } else {
            console.error("Speech synthesis not supported in this browser.");
            setErrorMessage("Speech synthesis not supported in this browser.");
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        setErrorMessage("");
        setTranslatedText("");

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setErrorMessage("Speech Recognition is not supported by this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
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
            speakText(response.data.translated_text); // Speak the translated text
        } catch (error) {
            console.error("Error translating speech:", error.response || error);
            setErrorMessage("Error translating speech. Please try again.");
        } finally {
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
                    <div className="form-group">
                        <textarea
                            className="text_area"
                            placeholder="Enter text to translate..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>From:</label>
                        <select
                            className="select"
                            value={sourceLanguage}
                            onChange={(e) => setSourceLanguage(e.target.value)}
                        >
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>To:</label>
                        <select
                            className="select"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                            {languages.map((lang) => (
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
                    <button
                        className="record-btn"
                        onClick={isRecording ? stopRecording : startRecording}
                    >
                        {isRecording ? "Stop Speaking" : "🎤 Start Speaking"}
                    </button>
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
