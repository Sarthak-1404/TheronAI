import React, { useState } from 'react';
import { Search, MessageCircle, Bell, User, Calendar, Grid3X3, Clock } from 'lucide-react';
import './doctor.css';

const App = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointmentView, setAppointmentView] = useState('next');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [availableSlots, setAvailableSlots] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });

  // Generate time slots from 8:00 AM to 5:30 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 17 && minute > 30) break;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = hour >= 12 
          ? `${hour === 12 ? 12 : hour - 12}:${minute.toString().padStart(2, '0')} PM`
          : `${hour}:${minute.toString().padStart(2, '0')} AM`;
        slots.push({ value: time, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleTimeSlot = (day, slot) => {
    setAvailableSlots(prev => ({
      ...prev,
      [day]: prev[day].includes(slot)
        ? prev[day].filter(s => s !== slot)
        : [...prev[day], slot].sort()
    }));
  };

  // Sample appointment data
  const appointments = {
    next: [
      { id: 1, patient: 'John Smith', time: '10:00 AM', date: 'Today', type: 'Consultation' },
      { id: 2, patient: 'Sarah Johnson', time: '2:30 PM', date: 'Today', type: 'Follow-up' }
    ],
    thisWeek: [
      { id: 3, patient: 'Mike Davis', time: '9:00 AM', date: 'Tomorrow', type: 'Check-up' },
      { id: 4, patient: 'Emily Wilson', time: '11:30 AM', date: 'Wed', type: 'Consultation' },
      { id: 5, patient: 'David Brown', time: '3:00 PM', date: 'Thu', type: 'Follow-up' },
      { id: 6, patient: 'Lisa Garcia', time: '10:00 AM', date: 'Fri', type: 'Check-up' }
    ],
    important: [
      { id: 7, patient: 'Robert Taylor', time: '9:30 AM', date: 'Tomorrow', type: 'Surgery Consultation', priority: 'High' },
      { id: 8, patient: 'Maria Martinez', time: '2:00 PM', date: 'Wed', type: 'Emergency Follow-up', priority: 'Urgent' }
    ]
  };

  const renderDashboard = () => (
    <div className="main-content">
      <h1 className="page-title">Healthcare Dashboard</h1>
      <p className="page-subtitle">Welcome to your healthcare management system. Here you can overview all your health data, appointments, and recent activities.</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Upcoming Appointments</h3>
          <p className="card-subtitle">You have 2 appointments this week</p>
        </div>
        
        <div className="dashboard-card">
          <h3 className="card-title">Health Records</h3>
          <p className="card-subtitle">Last updated 3 days ago</p>
        </div>
        
        <div className="dashboard-card">
          <h3 className="card-title">Messages</h3>
          <p className="card-subtitle">3 new messages from your healthcare provider</p>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="main-content">
      <h1 className="page-title">Appointments</h1>
      
      <div className="appointments-section">
        <div className="appointment-tabs">
          <button
            onClick={() => setAppointmentView('next')}
            className={`tab-button ${appointmentView === 'next' ? 'active' : ''}`}
          >
            Next Appointments
          </button>
          <button
            onClick={() => setAppointmentView('thisWeek')}
            className={`tab-button ${appointmentView === 'thisWeek' ? 'active' : ''}`}
          >
            This Week
          </button>
          <button
            onClick={() => setAppointmentView('important')}
            className={`tab-button ${appointmentView === 'important' ? 'active' : ''}`}
          >
            Important
          </button>
          <button
            onClick={() => setAppointmentView('timeSlots')}
            className={`tab-button ${appointmentView === 'timeSlots' ? 'active' : ''}`}
          >
            Available Time Slots
          </button>
        </div>

        {appointmentView !== 'timeSlots' && (
          <div className="appointments-list">
            {appointments[appointmentView].map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-info">
                  <div className="appointment-details">
                    <h3 className="patient-name">{appointment.patient}</h3>
                    <p className="appointment-type">{appointment.type}</p>
                    <div className="appointment-meta">
                      <span className="meta-item">
                        <Clock className="meta-icon" />
                        {appointment.time}
                      </span>
                      <span className="meta-item">
                        <Calendar className="meta-icon" />
                        {appointment.date}
                      </span>
                    </div>
                  </div>
                  {appointment.priority && (
                    <span className={`priority-badge ${appointment.priority.toLowerCase()}`}>
                      {appointment.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {appointmentView === 'timeSlots' && (
          <div className="time-slots-container">
            <h2 className="slots-title">Set Available Time Slots</h2>
            <div className="days-container">
              {Object.keys(availableSlots).map(day => (
                <div key={day} className="day-section">
                  <h3 className="day-title">{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                  <div className="time-slots-grid">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.value}
                        onClick={() => toggleTimeSlot(day, slot.value)}
                        className={`time-slot ${availableSlots[day].includes(slot.value) ? 'selected' : ''}`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                  {availableSlots[day].length > 0 && (
                    <p className="slots-count">
                      {availableSlots[day].length} slots selected
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="main-content">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Customize your account preferences and security</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Password & Security</h3>
          <p className="card-subtitle">Change password, enable 2FA</p>
          <button className="settings-button">Change Password</button>
          <button className="settings-button">Enable Two-Factor Auth</button>
        </div>
        
        <div className="dashboard-card">
          <h3 className="card-title">Notifications</h3>
          <p className="card-subtitle">Manage email and push notifications</p>
          <button className="settings-button">Email Notifications</button>
          <button className="settings-button">Push Notifications</button>
        </div>
        
        <div className="dashboard-card">
          <h3 className="card-title">Privacy & Data</h3>
          <p className="card-subtitle">Control your data and privacy settings</p>
          <button className="settings-button">Privacy Settings</button>
          <button className="settings-button">Data Export</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo">
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search patients, appointments, records..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="topbar-right">
          <button className="topbar-button">
            <MessageCircle className="topbar-icon" />
          </button>
          <button className="topbar-button notification-button">
            <Bell className="topbar-icon" />
            <span className="notification-dot"></span>
          </button>
          <div className="profile-dropdown-container">
            <button 
              className="topbar-button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <User className="topbar-icon" />
            </button>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                {/* Display user info at the top */}
                <div className="profile-info">
                  <div className="profile-name">Dr. Sarah Johnson</div>
                  <div className="profile-email">sarah.johnson@healthcare.com</div>
                </div>
                {/* Remove Profile option, keep Settings and Logout */}
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileDropdown(false);
                  }}
                >
                  Settings
                </button>
                <button className="dropdown-item" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`sidebar-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            title="Dashboard"
          >
            <Grid3X3 className="sidebar-icon" />
          </button>
          
          <button
            onClick={() => setActiveTab('appointments')}
            className={`sidebar-button ${activeTab === 'appointments' ? 'active' : ''}`}
            title="Appointments"
          >
            <Calendar className="sidebar-icon" />
          </button>
        </div>

        {/* Main Content */}
        <div className="content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default App;