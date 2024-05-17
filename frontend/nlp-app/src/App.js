import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [translationInput, setTranslationInput] = useState('');
    const [summarizationInput, setSummarizationInput] = useState('');
    const [qaContext, setQAContext] = useState('');
    const [qaQuestion, setQAQuestion] = useState('');
    const [output, setOutput] = useState('');

    const handleTranslate = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/post-data', { text: translationInput });
            setOutput(response.data.translated_text || "No translation available");
        } catch (error) {
            console.error("Error translating text:", error);
            setOutput("Error translating text");
        }
    };

    const handleSummarize = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/summarize', { text: summarizationInput });
            setOutput(response.data.summary || "No summary available");
        } catch (error) {
            console.error("Error summarizing text:", error);
            setOutput("Error summarizing text");
        }
    };

    const handleQA = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/answer', { context: qaContext, question: qaQuestion });
            setOutput(response.data.answer || "No answer available");
        } catch (error) {
            console.error("Error answering question:", error);
            setOutput("Error answering question");
        }
    };

    return (
        <div className="container">
            <h1>Fun with HuggingFace</h1>
            <div className="section">
                <h2>Translation</h2>
                <textarea className="textarea" value={translationInput} onChange={(e) => setTranslationInput(e.target.value)} placeholder="Enter text to translate"></textarea>
                <button className="button translation" onClick={handleTranslate}>Translate</button>
            </div>
            <div className="section">
                <h2>Summarization</h2>
                <textarea className="textarea" value={summarizationInput} onChange={(e) => setSummarizationInput(e.target.value)} placeholder="Enter text to summarize"></textarea>
                <button className="button summary" onClick={handleSummarize}>Summarize</button>
            </div>
            <div className="section">
                <h2>Question Answering</h2>
                <div className="input-group">
                    <textarea className="textarea" value={qaContext} onChange={(e) => setQAContext(e.target.value)} placeholder="Enter context"></textarea>
                    <textarea className="textarea" value={qaQuestion} onChange={(e) => setQAQuestion(e.target.value)} placeholder="Enter question"/>
                    <button className="button qa" onClick={handleQA}>Get Answer</button>
                </div>
            </div>
            <div className="section">
                <h2>Output</h2>
                <textarea className="output" value={output} readOnly></textarea>
            </div>
        </div>
    );
}

export default App;
