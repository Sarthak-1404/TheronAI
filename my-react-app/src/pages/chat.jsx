import React, { useState, useRef, useEffect } from 'react';
import './chat.css';

const Chat = ({ doctor, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'doctor',
      content: `Hello! I'm Dr. ${doctor.name}. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        type: 'user',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate doctor typing and response
      setIsTyping(true);
      setTimeout(() => {
        const doctorResponse = {
          id: messages.length + 2,
          type: 'doctor',
          content: getDoctorResponse(newMessage),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, doctorResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const getDoctorResponse = (userMessage) => {
    const responses = [
      "Thank you for sharing that information. I'll review it and get back to you shortly.",
      "I understand your concern. Let me provide you with some guidance on this.",
      "That's a good question. Based on what you've described, I would recommend...",
      "I appreciate you reaching out. This is something we should discuss further.",
      "Thank you for the details. I'll make sure to address this in our next appointment.",
      "I see what you're experiencing. Let me help you with some recommendations."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      
      const message = {
        id: messages.length + 1,
        type: 'user',
        content: `📎 ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFile: true,
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      };
      setMessages([...messages, message]);
    }
  };

  const handleMicClick = () => {
    // Simulate voice recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          alert('Voice recording started. Click again to stop.');
        })
        .catch(() => {
          alert('Voice recording feature would be implemented here');
        });
    } else {
      alert('Voice recording feature would be implemented here');
    }
  };



  return (
    <div className="chat-container">
        {/* Doctor Profile Header */}
        <div className="chat-header">
          <div className="doctor-profile">
            <div className="doctor-avatar">
              <img src={doctor.image} alt={doctor.name} />
            </div>
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              <p>{doctor.specialization}</p>
              <div className="doctor-details">
                <span className="rating">★ {doctor.rating}</span>
                <span className="experience">{doctor.experience}</span>
                <span className="online-status">● Online</span>
              </div>
            </div>
          </div>
          <button className="close-chat" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.type === 'doctor' && (
                  <div className="message-avatar">
                    <img src={doctor.image} alt={doctor.name} />
                  </div>
                )}
                <div className="message-content">
                  <div className="message-bubble">
                    {message.isFile ? (
                      <div className="file-message">
                        <span className="file-icon">📎</span>
                        <div className="file-details">
                          <span className="file-name">{message.fileName}</span>
                          <span className="file-size">{message.fileSize}</span>
                        </div>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message doctor">
                <div className="message-avatar">
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="message-input-container">
          <div className="message-input-wrapper">
            <textarea
              className="message-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <div className="input-actions">
              <button 
                className="action-btn upload-btn"
                onClick={handleFileUpload}
                title="Upload document"
              >
                📎
              </button>
              <button 
                className="action-btn mic-btn"
                onClick={handleMicClick}
                title="Voice message"
              >
                🎤
              </button>
              <button 
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                ➤
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
      </div>
  );
};

export default Chat; 