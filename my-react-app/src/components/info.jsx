import React from 'react';
import './info.css';

const Info = ({ onNext, userData, setUserData }) => {
  const handleGenderSelect = (gender) => {
    setUserData({ ...userData, gender });
  };

  const handleContinue = () => {
    if (userData.age && userData.gender) {
      onNext();
    }
  };

  return (
    <div className="step-container">
      <div className="info-container">
        {/* Step header inside scrollable container */}
        <div className="step-header">
          <h2>Basic Information</h2>
          <p>Please provide your basic information to help us assess your symptoms</p>
        </div>
        
        <div className="info-content">
          {/* Age Input */}
          <div className="age-section">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              value={userData.age || ''}
              onChange={(e) => setUserData({ ...userData, age: e.target.value })}
              placeholder="Enter your age"
              min="1"
              max="120"
            />
          </div>
          
          {/* Gender Selection Cards */}
          <div className="gender-section">
            <label>Gender</label>
            <div className="gender-cards">
              <div 
                className={`gender-card ${userData.gender === 'male' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('male')}
              >
                <div className="gender-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v8"></path>
                    <path d="M8 12h8"></path>
                  </svg>
                </div>
                <span>Male</span>
              </div>
              
              <div 
                className={`gender-card ${userData.gender === 'female' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('female')}
              >
                <div className="gender-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v8"></path>
                    <path d="M8 12h8"></path>
                    <path d="M12 16v4"></path>
                  </svg>
                </div>
                <span>Female</span>
              </div>
              
              <div 
                className={`gender-card ${userData.gender === 'other' ? 'selected' : ''}`}
                onClick={() => handleGenderSelect('other')}
              >
                <div className="gender-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v8"></path>
                    <path d="M8 12h8"></path>
                    <path d="M12 16v4"></path>
                    <path d="M8 16h8"></path>
                  </svg>
                </div>
                <span>Other</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="step-actions">
        <button 
          className="continue-btn"
          onClick={handleContinue}
          disabled={!userData.age || !userData.gender}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Info;
