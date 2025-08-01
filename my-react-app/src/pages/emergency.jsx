import React, { useState } from 'react';
import './emergency.css';

const Emergency = ({ onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const emergencyOptions = [
    {
      id: 'ambulance',
      title: 'Call Ambulance',
      description: 'Emergency medical services',
      phone: '911',
      icon: '🚑',
      color: '#e74c3c'
    },
    {
      id: 'police',
      title: 'Call Police',
      description: 'Emergency law enforcement',
      phone: '911',
      icon: '👮',
      color: '#3498db'
    },
    {
      id: 'fire',
      title: 'Call Fire Department',
      description: 'Fire and rescue services',
      phone: '911',
      icon: '🚒',
      color: '#e67e22'
    },
    {
      id: 'poison',
      title: 'Poison Control',
      description: 'Poison information center',
      phone: '1-800-222-1222',
      icon: '☠️',
      color: '#9b59b6'
    },
    {
      id: 'suicide',
      title: 'Suicide Prevention',
      description: 'Crisis intervention',
      phone: '988',
      icon: '💙',
      color: '#2ecc71'
    },
    {
      id: 'domestic',
      title: 'Domestic Violence',
      description: 'Domestic abuse hotline',
      phone: '1-800-799-7233',
      icon: '🛡️',
      color: '#e91e63'
    }
  ];

  const handleCall = (option) => {
    setSelectedOption(option);
    // In a real app, this would initiate a phone call
    console.log(`Calling ${option.phone} for ${option.title}`);
    
    // Simulate call initiation
    setTimeout(() => {
      alert(`Initiating call to ${option.phone} for ${option.title}`);
      onClose();
    }, 1000);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="emergency-overlay" onClick={onClose}>
      <div className="emergency-popup" onClick={(e) => e.stopPropagation()}>
        <div className="emergency-header">
          <div className="emergency-icon">🚨</div>
          <h2>Emergency Services</h2>
          <p>Select the appropriate emergency service</p>
        </div>
        
        <div className="emergency-options">
          {emergencyOptions.map((option) => (
            <div 
              key={option.id}
              className="emergency-option"
              onClick={() => handleCall(option)}
              style={{ borderColor: option.color }}
            >
              <div className="option-icon" style={{ backgroundColor: option.color }}>
                {option.icon}
              </div>
              <div className="option-content">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <span className="phone-number">{option.phone}</span>
              </div>
              <div className="call-icon">
                📞
              </div>
            </div>
          ))}
        </div>
        
        <div className="emergency-footer">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <div className="emergency-note">
            <p>⚠️ Only call emergency services for genuine emergencies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency; 