import React from 'react';
import './dashboard.css';

const Dashboard = ({ onPageChange }) => {
  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Healthcare Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome to your healthcare management system.
        </p>
        <p className="dashboard-description">
          Here you can overview all your health data, appointments, and recent activities.
        </p>
      </div>

      {/* Cards Section */}
      <div className="dashboard-cards">
        {/* Upcoming Appointments Card */}
        <div className="dashboard-card clickable" onClick={() => onPageChange('appointments')}>
          <div className="card-header">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="notification-badge">2</div>
          </div>
          <div className="card-content">
            <h3 className="card-title">Upcoming Appointments</h3>
            <p className="card-text">You have 2 appointments this week</p>
          </div>
        </div>

        {/* Health Records Card */}
        <div className="dashboard-card clickable" onClick={() => onPageChange('health-records')}>
          <div className="card-header">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
            </div>
            <div className="notification-badge">1</div>
          </div>
          <div className="card-content">
            <h3 className="card-title">Health Records</h3>
            <p className="card-text">Last updated 3 days ago</p>
          </div>
        </div>

        {/* Messages Card */}
        <div className="dashboard-card clickable" onClick={() => onPageChange('messages')}>
          <div className="card-header">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="notification-badge">3</div>
          </div>
          <div className="card-content">
            <h3 className="card-title">Messages</h3>
            <p className="card-text">3 new messages from your healthcare provider</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
