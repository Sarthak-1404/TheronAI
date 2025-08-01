import React, { useState } from 'react';
import './navbar.css';


const Navbar = ({ onMessageClick, onNotificationClick, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  // Get user data from localStorage
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && Object.keys(user).length > 0) {
      setUserData(user);
    }
  }, []);

  // Listen for changes in localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && Object.keys(user).length > 0) {
        setUserData(user);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMessageClick = () => {
    console.log('Message button clicked');
    if (onMessageClick) {
      onMessageClick();
    }
  };

  const handleNotificationClick = () => {
    console.log('Notification button clicked');
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    console.log('Profile button clicked');
    // Add your profile functionality here
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setShowProfileMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.profile-container')) {
      setShowProfileMenu(false);
    }
  };

  // Add click listener to close menu when clicking outside
  React.useEffect(() => {
    if (showProfileMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProfileMenu]);

  console.log('Navbar rendering, userData:', userData);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Logo/Image container */}
        <div className="navbar-left">
          <div className="logo-container">
            <div className="logo-placeholder">
              LOGO
            </div>
          </div>
        </div>

        {/* Right side - Circular buttons */}
        <div className="navbar-right">
          <button 
            className="nav-button message-button" 
            onClick={handleMessageClick}
            title="Messages"
          >
            <svg  className='nav-button-icon' width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          <button 
            className="nav-button notification-button" 
            onClick={handleNotificationClick}
            title="Notifications"
          >
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="m13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>

          <div className="profile-container">
            <button 
              className={`nav-button profile-button ${showProfileMenu ? 'active' : ''}`}
              onClick={handleProfileClick}
              title="Profile"
            >
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {/* Profile Popup Menu */}
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">{userData?.name || userData?.firstName || 'User'}</div>
                    <div className="profile-email">{userData?.email || 'user@example.com'}</div>
                  </div>
                </div>
                <div className="profile-divider"></div>
                <div className="profile-actions">
                  <button className="profile-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile Settings
                  </button>
                  <button className="profile-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                      <path d="m13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    Notifications
                  </button>
                  <button className="profile-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Security
                  </button>
                  <button className="profile-action-btn logout-btn" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
