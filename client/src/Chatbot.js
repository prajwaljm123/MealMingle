import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import chatIconGif from './chatbot_icon.gif'; // Make sure this path is correct

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isChatIconVisible, setChatIconVisible] = useState(true); // State to track chat icon visibility
    const [isChatbotOpen, setChatbotOpen] = useState(false); // State to track chatbot visibility
    const chatbotRef = useRef(null); // Reference for the chatbot component

    const handleSend = async () => {
        if (!userInput.trim()) return;
        
        // Update the chat messages with the user input
        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);

        // Send request to chatbot API
        try {
            const response = await fetch('http://127.0.0.1:5001/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userInput,
                    history: messages.map(msg => ({ user: msg.sender === 'user' ? msg.text : '', assistant: msg.sender === 'bot' ? msg.text : '' }))
                })
            });

            const data = await response.json();
            const botResponse = data.response;

            // Update messages with the bot's response
            setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
            setUserInput('');
        } catch (error) {
            console.error("Error in chatbot response:", error);
        }
    };

    const handleToggleChatbot = () => {
        setChatIconVisible(false); // Hide the chat icon
        setChatbotOpen(true); // Show the chatbot
    };

    const handleOutsideClick = (e) => {
        if (chatbotRef.current && !chatbotRef.current.contains(e.target)) {
            setChatbotOpen(false); // Hide the chatbot when clicking outside
            setChatIconVisible(true); // Show the chat icon again
        }
    };

    useEffect(() => {
        // Add event listener for clicks outside the chatbot
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    return (
        <>
            {isChatIconVisible && ( // Conditionally render the chat icon
                <img 
                    src={chatIconGif} 
                    alt="Chat Icon" 
                    className="chat-icon" 
                    onClick={handleToggleChatbot} 
                    style={{ cursor: 'pointer', width: '120px', height: '120px' }} // Adjust size as needed
                />
            )}
            {isChatbotOpen && ( // Conditionally render the chatbot
                <div className="chatbot" ref={chatbotRef}>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask me anything about MealMingle..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Chatbot;
