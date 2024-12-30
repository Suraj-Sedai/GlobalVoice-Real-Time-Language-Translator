import React, { useState } from "react";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
    const [translatedText, setTranslatedText] = useState("");

    const handleTranslate = () => {
        console.log("Translating:", inputText, "to", selectedLanguage);
        
        // Simulate translation by appending " (Translated)" for now
        setTranslatedText(`${inputText} (Translated to ${selectedLanguage})`);
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
            <button onClick={handleTranslate}>Translate</button>

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
