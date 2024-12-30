import React, { useState } from "react";

const HomePage = () => {
    const [inputText, setInputText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("Spanish");

    const handleTranslate = () => {
        console.log("Translating:", inputText, "to", selectedLanguage);
        // Add translation functionality here
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Real-Time Language Translator</h1>
            <div>
                <textarea
                    placeholder="Enter text to translate..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{
                        width: "300px",
                        height: "100px",
                        marginBottom: "20px",
                        padding: "10px",
                        fontSize: "16px",
                    }}
                ></textarea>
            </div>
            <div>
                <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{
                        width: "200px",
                        padding: "10px",
                        fontSize: "16px",
                        marginBottom: "20px",
                    }}
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
            <button
                onClick={handleTranslate}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Translate
            </button>
        </div>
    );
};

export default HomePage;
