import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("English");
    const [targetLanguage, setTargetLanguage] = useState("Spanish");
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("text"); // "text" or "speech"

    const languages = ["English", "Spanish", "French", "Chinese", "Hindi", "Italian", "German", "Nepali"];

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
                            {languages.map((lang) => (
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
                            {languages.map((lang) => (
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
                    <button className="record-btn">🎤 Start Speaking</button>
                    <div className="speech-output">
                        <h2>Translation:</h2>
                        <p>Output speech will appear here...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
