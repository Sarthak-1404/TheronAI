import React, { useState, useEffect, useRef } from 'react';
import './homebot.css';
import HomeNav from '../components/homenav';

const Chatbot = ({ onEmergencyClick, onLoginClick, onSignupClick, onAboutClick, onContactClick, onHomeClick }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m your AI healthcare assistant. How can I help you today?',
      timestamp: '10:30 AM'
    },
    {
      id: 2,
      type: 'user',
      message: 'I have a headache and fever',
      timestamp: '10:31 AM'
    },
    {
      id: 3,
      type: 'bot',
      message: 'I\'m sorry to hear that. How long have you been experiencing these symptoms?',
      timestamp: '10:31 AM'
    }
  ]);

  const chatMessagesRef = useRef(null);

  // Auto scroll to bottom when chat history changes
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        id: chatHistory.length + 1,
        type: 'user',
        message: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      const currentMessage = message;
      setMessage('');
      
      try {
        // Call the Python chatbot backend
        const response = await fetch('http://localhost:5001/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentMessage
          }),
        });

        const data = await response.json();

        if (data.status === 'success') {
          const botResponse = {
            id: chatHistory.length + 2,
            type: 'bot',
            message: data.response,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatHistory(prev => [...prev, botResponse]);
        } else {
          // Fallback response if API fails
          const fallbackResponse = {
            id: chatHistory.length + 2,
            type: 'bot',
            message: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact support if the issue persists.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatHistory(prev => [...prev, fallbackResponse]);
        }
      } catch (error) {
        console.error('Chatbot API error:', error);
        // Fallback response if API is not available
        const fallbackResponse = {
          id: chatHistory.length + 2,
          type: 'bot',
          message: 'I\'m sorry, but I\'m currently unable to connect to my AI service. Please make sure the chatbot backend is running on port 5001.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, fallbackResponse]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMicClick = () => {
    console.log('Microphone button clicked');
    // Add voice input functionality here
  };

  const handleAttachmentClick = () => {
    console.log('Attachment button clicked');
    // Add file attachment functionality here
  };

  return (
    <div className="chatbot">
      <HomeNav 
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onAboutClick={onAboutClick}
        onContactClick={onContactClick}
        onHomeClick={onHomeClick}
      />
      
      {/* Chat Section */}
      <div className="chat-section">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="bot-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M13 8H7"></path>
                <path d="M17 12H7"></path>
              </svg>
            </div>
            <div className="bot-info">
              <h3>AI Healthcare Assistant</h3>
              <span className="status">Online</span>
            </div>
          </div>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {chatHistory.map((chat) => (
            <div key={chat.id} className={`message ${chat.type}`}>
              <div className="message-content">
                <p>{chat.message}</p>
                <span className="message-time">{chat.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <button className="attachment-btn inside" onClick={handleAttachmentClick} tabIndex={-1} aria-label="Attach file">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat-input"
            />
            <button className="mic-btn inside" onClick={handleMicClick} tabIndex={-1} aria-label="Voice input">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Health Issue Description Section */}
      <div className="description-section">
        <div className="description-header">
          <h2>Health Issue Analysis</h2>
          <p>AI-powered symptom analysis and recommendations</p>
        </div>
        
        <div className="health-issues">
          <div className="issue-card">
            <div className="issue-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
              </svg>
            </div>
            <div className="issue-content">
              <h4>Headache</h4>
              <p className="severity">Severity: Moderate</p>
              <p className="description">Tension headache with possible stress-related causes. Consider rest, hydration, and over-the-counter pain relievers.</p>
              <div className="recommendations">
                <span className="recommendation">Rest in a quiet, dark room</span>
                <span className="recommendation">Stay hydrated</span>
                <span className="recommendation">Consider pain relievers</span>
              </div>
            </div>
          </div>

          <div className="issue-card">
            <div className="issue-icon fever">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2v20"></path>
                <path d="M8 8l4 4 4-4"></path>
              </svg>
            </div>
            <div className="issue-content">
              <h4>Fever</h4>
              <p className="severity">Severity: High</p>
              <p className="description">Elevated body temperature indicating possible infection. Monitor temperature and consider medical attention if persistent.</p>
              <div className="recommendations">
                <span className="recommendation">Monitor temperature</span>
                <span className="recommendation">Stay hydrated</span>
                <span className="recommendation">Seek medical attention if &gt;103°F</span>
              </div>
            </div>
          </div>

          <div className="issue-card">
            <div className="issue-icon fatigue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="issue-content">
              <h4>Fatigue</h4>
              <p className="severity">Severity: Low</p>
              <p className="description">General tiredness and lack of energy. Common with illness and stress. Focus on rest and proper nutrition.</p>
              <div className="recommendations">
                <span className="recommendation">Get adequate sleep</span>
                <span className="recommendation">Eat nutritious meals</span>
                <span className="recommendation">Reduce stress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Section - Bottom Right Corner */}
        <div className="emergency-section">
          <div className="emergency-info">
            <p>Need immediate medical attention?</p>
            <p className="emergency-subtitle">Call emergency services</p>
          </div>
          <button className="emergency-btn" onClick={onEmergencyClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Emergency Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 