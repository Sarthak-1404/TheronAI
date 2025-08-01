import React from 'react';
import './homenav.css';

const HomeNav = ({ onLoginClick, onSignupClick, onAboutClick, onContactClick, onHomeClick }) => {
  return (
    <nav className="home-nav">
      <div className="nav-container">
        {/* Left side - Logo and brand name */}
        <div className="nav-left">
          <button className="logo-container" onClick={onHomeClick}>
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
              </svg>
            </div>
            <span className="brand-name">SmartHealth</span>
          </button>
        </div>

        {/* Right side - Navigation links and buttons */}
        <div className="nav-right">
          <button className="nav-link" onClick={onAboutClick}>
            About Us
          </button>
          <button className="nav-link" onClick={onContactClick}>
            Contact Us
          </button>
          <div className="auth-buttons">
            <button className="auth-btn login-btn" onClick={onLoginClick}>
              Login
            </button>
            <button className="auth-btn signup-btn" onClick={onSignupClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav; 