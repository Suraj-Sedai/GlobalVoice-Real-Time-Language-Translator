import React, { useState } from "react";
import axios from "axios";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
    const [translatedText, setTranslatedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);  // To track the loading state
    const [errorMessage, setErrorMessage] = useState("");  // To track error messages

    const handleTranslate = async () => {
        console.log("Translating:", inputText, "to", selectedLanguage);
        setIsLoading(true);  // Set loading state to true when the request is initiated
        setErrorMessage("");  // Clear any previous error message

        try {
            // Send a POST request to the backend API
            const response = await axios.post("http://localhost:8000/api/translate/", {
                input_text: inputText,
                target_language: selectedLanguage,
            });

            console.log("Backend response:", response.data);  // Log the backend response
            // Set translated text received from the backend
            setTranslatedText(response.data.translated_text);
        } catch (error) {
            console.error("Error translating text:", error);
            setErrorMessage("Error translating text. Please try again.");
        } finally {
            setIsLoading(false);  // Set loading state to false after the request is completed
        }
    };

    return (
        <div className="container">
            <h1>Real-Time Language Translator</h1>
            <div>
                <textarea
                    className="text_area"
                    placeholder="Enter text to translate..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                ></textarea>
            </div>
            <div>
                <select
                    className="select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Hindi">Hindi</option>
                </select>
            </div>
            <button onClick={handleTranslate} disabled={isLoading}>
                {isLoading ? "Translating..." : "Translate"}
            </button>

            {/* Display error message */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {/* Display Translated Text */}
            {translatedText && (
                <div className="translated-text">
                    <h2>Translated Text:</h2>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
