import React, { useState } from 'react';
import './chatpopup.css';

const ChatPopup = ({ onClose, onSelectDoctor }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock doctors data
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      rating: 4.8,
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      location: "New York",
      lastMessage: "How are you feeling today?",
      lastMessageTime: "2:30 PM"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Neurology",
      rating: 4.9,
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      location: "Los Angeles",
      lastMessage: "I'll review your test results",
      lastMessageTime: "1:45 PM"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Pediatrics",
      rating: 4.7,
      experience: "8 years",
      image: "https://images.unsplash.com/photo-1594824475544-3d9c2c7c3c3c?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      location: "Chicago",
      lastMessage: "Your appointment is confirmed",
      lastMessageTime: "11:20 AM"
    },
    {
      id: 4,
      name: "Dr. David Kim",
      specialization: "Orthopedics",
      rating: 4.6,
      experience: "20 years",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      availability: "Busy",
      location: "Houston",
      lastMessage: "Let's schedule a follow-up",
      lastMessageTime: "Yesterday"
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialization: "Dermatology",
      rating: 4.9,
      experience: "10 years",
      image: "https://images.unsplash.com/photo-1594824475544-3d9c2c7c3c3c?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      location: "Phoenix",
      lastMessage: "Your prescription is ready",
      lastMessageTime: "Yesterday"
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      specialization: "Psychiatry",
      rating: 4.8,
      experience: "18 years",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      availability: "Available",
      location: "Philadelphia",
      lastMessage: "How was your week?",
      lastMessageTime: "2 days ago"
    }
  ];

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    onSelectDoctor(doctor);
  };

  const handleBackToList = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="chat-popup-overlay" onClick={onClose}>
      <div className="chat-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="chat-popup-header">
          <h2>Chat with Doctors</h2>
          <button className="close-popup" onClick={onClose}>×</button>
        </div>

        {!selectedDoctor ? (
          <>
            <div className="search-section">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="doctor-search"
              />
            </div>

            <div className="doctors-list">
              {filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id} 
                  className="doctor-item"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="doctor-avatar">
                    <img src={doctor.image} alt={doctor.name} />
                    <div className={`status-indicator ${doctor.availability.toLowerCase()}`}></div>
                  </div>
                  <div className="doctor-info">
                    <div className="doctor-name-specialty">
                      <h4>{doctor.name}</h4>
                      <span className="specialty">{doctor.specialization}</span>
                    </div>
                    <div className="doctor-details">
                      <span className="rating">★ {doctor.rating}</span>
                      <span className="experience">{doctor.experience}</span>
                    </div>
                    <div className="last-message">
                      <p>{doctor.lastMessage}</p>
                      <span className="message-time">{doctor.lastMessageTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="selected-doctor-chat">
            <div className="selected-doctor-header">
              <button className="back-btn" onClick={handleBackToList}>
                ← Back
              </button>
              <div className="selected-doctor-info">
                <img src={selectedDoctor.image} alt={selectedDoctor.name} />
                <div>
                  <h4>{selectedDoctor.name}</h4>
                  <span>{selectedDoctor.specialization}</span>
                </div>
              </div>
            </div>
            <div className="chat-placeholder">
              <p>Click "Start Chat" to begin conversation with {selectedDoctor.name}</p>
              <button 
                className="start-chat-btn"
                onClick={() => onSelectDoctor(selectedDoctor)}
              >
                Start Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPopup; 