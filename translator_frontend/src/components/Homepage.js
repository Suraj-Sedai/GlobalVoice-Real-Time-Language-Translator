import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [speechInput, setSpeechInput] = useState(""); // State for speech input
    const [sourceLanguage, setSourceLanguage] = useState("auto"); // Default is auto-detect
    const [targetLanguage, setTargetLanguage] = useState("es"); // Default to Spanish
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("text"); // "text" or "speech"
    const [isRecording, setIsRecording] = useState(false);

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

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setErrorMessage("Speech Recognition is not supported by this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = sourceLanguage;
        recognition.continuous = false;

        recognition.onresult = async (event) => {
            const recognizedText = event.results[0][0].transcript;
            console.log("Recognized Speech:", recognizedText);
            setSpeechInput(recognizedText);

            try {
                setIsLoading(true);
                const response = await axios.post("http://localhost:8000/api/translate/", {
                    input_text: recognizedText,
                    source_language: sourceLanguage,
                    target_language: targetLanguage,
                });
                const translatedText = response.data.translated_text;
                setTranslatedText(translatedText);

                const utterance = new SpeechSynthesisUtterance(translatedText);
                utterance.lang = targetLanguage;
                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error("Error translating speech:", error.response || error);
                setErrorMessage("Error translating speech. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setErrorMessage("Speech recognition error. Please try again.");
        };

        recognition.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.stop();
    };

    return (
        <div className="home-container">
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

            {activeTab === "text" ? (
                <div className="text-tab">
                    <h1>Text Translator</h1>
                    <textarea
                        className="text_area"
                        placeholder="Enter text to translate..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                    <div className="language-selectors">
                        <div>
                            <label>From:</label>
                            <select
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
                        <div>
                            <label>To:</label>
                            <select
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                            >
                                {languages
                                    .filter((lang) => lang.code !== "auto")
                                    .map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
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
                    <h1>Speech Translator</h1>
                    <button onClick={isRecording ? stopRecording : startRecording}>
                        {isRecording ? "Stop Speaking" : "🎤 Start Speaking"}
                    </button>
                    <div className="form-group">
                        <label>Recognized Speech:</label>
                        <textarea
                            className="text_area"
                            value={speechInput}
                            readOnly
                            placeholder="Your speech will appear here..."
                        ></textarea>
                    </div>
                    <div className="language-selectors">
                        <div>
                            <label>From:</label>
                            <select
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
                        <div>
                            <label>To:</label>
                            <select
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                            >
                                {languages
                                    .filter((lang) => lang.code !== "auto")
                                    .map((lang) => (
                                        <option key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
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
