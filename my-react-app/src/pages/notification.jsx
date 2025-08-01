import React, { useState } from 'react';
import './notification.css';

const Notification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'You have an appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
      time: '2 hours ago',
      read: false,
      icon: '📅'
    },
    {
      id: 2,
      type: 'message',
      title: 'New Message',
      message: 'Dr. Michael Chen sent you a message about your test results',
      time: '4 hours ago',
      read: false,
      icon: '💬'
    },
    {
      id: 3,
      type: 'test',
      title: 'Test Results Ready',
      message: 'Your blood test results are now available in Health Records',
      time: '1 day ago',
      read: true,
      icon: '🔬'
    },
    {
      id: 4,
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Time to take your prescribed medication',
      time: '2 days ago',
      read: true,
      icon: '💊'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'Your health records have been updated with new information',
      time: '3 days ago',
      read: true,
      icon: '⚙️'
    }
  ]);

  const [markReadClicked, setMarkReadClicked] = useState(false);
  const [clearAllClicked, setClearAllClicked] = useState(false);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Mark individual notification as read when clicked
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notification.id ? { ...notif, read: true } : notif
      )
    );
    
    // Handle notification click based on type
    switch (notification.type) {
      case 'appointment':
        // Navigate to appointments
        break;
      case 'message':
        // Open chat
        break;
      case 'test':
        // Navigate to health records
        break;
      default:
        break;
    }
  };

  const handleMarkAllRead = () => {
    console.log('Mark all as read');
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    setMarkReadClicked(true);
    setTimeout(() => setMarkReadClicked(false), 1500);
  };

  const handleClearAll = () => {
    console.log('Clear all notifications');
    setNotifications([]);
    setClearAllClicked(true);
    setTimeout(() => setClearAllClicked(false), 1500);
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-popup" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <div className="notification-actions">
            <button className={`action-btn ${markReadClicked ? 'success' : ''}`} onClick={handleMarkAllRead}>
              {markReadClicked ? 'Marked!' : 'Mark all read'}
            </button>
            <button className={`action-btn ${clearAllClicked ? 'success' : ''}`} onClick={handleClearAll}>
              {clearAllClicked ? 'Cleared!' : 'Clear all'}
            </button>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {notification.icon}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{notification.time}</div>
                </div>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <div className="no-notifications-icon">🔔</div>
              <p>No new notifications</p>
              <span>You're all caught up!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification; 