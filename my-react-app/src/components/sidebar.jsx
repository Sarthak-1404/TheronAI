import React from 'react';
import './sidebar.css';

const Sidebar = ({ onPageChange, currentPage, isAdmin }) => {
  const handleButtonClick = (buttonName) => {
    onPageChange(buttonName);
    console.log(`${buttonName} button clicked`);
    // Add your navigation functionality here
  };

  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <button 
          className={`sidebar-button ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleButtonClick('dashboard')}
          title="Dashboard"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span className="button-text">Dashboard</span>
        </button>

        <button 
          className={`sidebar-button ${currentPage === 'chatbot' ? 'active' : ''}`}
          onClick={() => handleButtonClick('chatbot')}
          title="Chatbot"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            <path d="M13 8H7"></path>
            <path d="M17 12H7"></path>
          </svg>
          <span className="button-text">Chatbot</span>
        </button>

        <button 
          className={`sidebar-button ${currentPage === 'symptom-checker' ? 'active' : ''}`}
          onClick={() => handleButtonClick('symptom-checker')}
          title="Symptom Checker"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
            <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
            <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
            <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
          </svg>
          <span className="button-text">Symptom Checker</span>
        </button>

        <button 
          className={`sidebar-button ${currentPage === 'appointments' ? 'active' : ''}`}
          onClick={() => handleButtonClick('appointments')}
          title="Appointments"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="button-text">Appointments</span>
        </button>

        <button 
          className={`sidebar-button ${currentPage === 'health-records' ? 'active' : ''}`}
          onClick={() => handleButtonClick('health-records')}
          title="Health Records"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
          <span className="button-text">Health Records</span>
        </button>

        {isAdmin && (
          <button 
            className={`sidebar-button ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => handleButtonClick('admin')}
            title="Admin"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            <span className="button-text">Admin</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;



