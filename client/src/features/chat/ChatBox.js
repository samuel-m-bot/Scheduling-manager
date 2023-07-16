import React, { useState } from "react";
import { useChatWithAIMutation } from "./chatApiSlice";
import './ChatBox.css';
import { CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faX } from '@fortawesome/free-solid-svg-icons'

const ChatBox = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const [chatWithAI, { isLoading }] = useChatWithAIMutation();

    const handleSendMessage = async () => {
      if (messageText.trim() !== '') {
        setMessages([...messages, { text: messageText, sender: 'user' }]);
        setMessageText('');
        const result = await chatWithAI(messageText);
        if ('data' in result) {
          setMessages(prevMessages => [...prevMessages, { text: result.data.aiMessage, sender: 'ai' }]);
        }
      }
    };

    return (
      <>
        <div className={`chat-container ${open ? '' : 'closed'}`}>
          {open && (
            <div className="chat-box">
              <button className="close-chat-button" onClick={() => setOpen(!open)}>
                <FontAwesomeIcon icon={faX} />
              </button>
              Powered by GPT-3 Turbo
              <div className="chat-box-messages">
                <div className="message-container">
                  {messages.map((message, index) => (
                    <p key={index} className={`chat-message ${message.sender}`}>
                      {message.text}
                    </p>
                  ))}
                </div>
              </div>
              {isLoading && (
                <div className="loading-indicator">
                  <CircularProgress />
                </div>
              )}
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Type your message..."
                className="chat-box-input"
              />
              <button onClick={handleSendMessage} disabled={isLoading || messageText.trim() === ''}>
                Send
              </button>
            </div>
          )}
        </div>
        {!open && (
          <button className="chat-icon-button" onClick={() => setOpen(!open)}>
            <FontAwesomeIcon icon={faMessage} />
          </button>
        )}
    </>
    );
};

export default ChatBox;
