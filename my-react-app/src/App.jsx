import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import Chatbot from './pages/chatbot';
import SymptomChecker from './pages/symptomchecker';
import HomeSymptom from './pages/homesymptom';
import HomeBot from './pages/homebot';
import Appointment from './pages/appointment';
import HealthRecords from './pages/healthrecords';
import ChatPopup from './pages/chatpopup';
import Chat from './pages/chat';
import Notification from './pages/notification';
import Emergency from './pages/emergency';
import ExportRecords from './pages/exportrecords';
import AddRecord from './pages/addrecord';
import Admin from './pages/admin';
import Login from './components/login';
import Signup from './components/signup';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showExportRecords, setShowExportRecords] = useState(false);
  const [showAddRecord, setShowAddRecord] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('App.jsx useEffect - token:', token, 'user:', user);
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
      setCurrentPage('dashboard');
      console.log('User is logged in, isAdmin:', user.role === 'admin');
    } else {
      console.log('No token found, user not logged in');
    }
  }, []);

  const handleLogin = (email, password, userData) => {
    console.log('App.jsx handleLogin called with:', { email, password, userData });
    // Check for demo credentials
    if (email === 'user@123' && password === 'user123') {
      console.log('Setting login state to true...');
      setIsLoggedIn(true);
      setIsAdmin(false);
      setCurrentPage('dashboard');
      setShowLogin(false);
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ email, name: 'Demo User', role: 'user' }));
      console.log('Login successful, should redirect to dashboard');
    } else if (email === 'admin@smarthealth.com' && password === 'admin123') {
      console.log('Setting admin login state to true...');
      setIsLoggedIn(true);
      setIsAdmin(true);
      setCurrentPage('admin');
      setShowLogin(false);
      localStorage.setItem('token', 'admin-demo-token');
      localStorage.setItem('user', JSON.stringify({ email, name: 'Admin User', role: 'admin' }));
      console.log('Admin login successful, should redirect to admin dashboard');
    } else {
      console.log('Invalid credentials in App.jsx');
      alert('Invalid credentials. Use user@123 / user123 for user login or admin@smarthealth.com / admin123 for admin login.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage('home');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handlePageChange = (page) => {
    if (page === 'messages') {
      setShowChatPopup(true);
      setCurrentPage('dashboard');
    } else {
      setCurrentPage(page);
      setSelectedDoctor(null);
      setShowChat(false);
      setShowChatPopup(false);
      setShowNotification(false);
      setShowEmergency(false);
      setShowExportRecords(false);
      setShowAddRecord(false);
    }
  };

  const handleMessageClick = () => {
    setShowChatPopup(true);
  };

  const handleNotificationClick = () => {
    setShowNotification(true);
  };

  const handleEmergencyClick = () => {
    setShowEmergency(true);
  };

  const handleExportRecordsClick = () => {
    setShowExportRecords(true);
  };

  const handleAddRecordClick = () => {
    setShowAddRecord(true);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowChat(true);
    setShowChatPopup(false);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedDoctor(null);
  };

  const handleCloseChatPopup = () => {
    setShowChatPopup(false);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleCloseEmergency = () => {
    setShowEmergency(false);
  };

  const handleCloseExportRecords = () => {
    setShowExportRecords(false);
  };

  const handleCloseAddRecord = () => {
    setShowAddRecord(false);
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseSignup = () => {
    setShowSignup(false);
  };

  const handleSignupSuccess = (userData) => {
    console.log('Signup successful, logging in user:', userData);
    setIsLoggedIn(true);
    setIsAdmin(userData.role === 'admin');
    setCurrentPage('dashboard');
    setShowSignup(false);
  };

  const handleAboutClick = () => {
    console.log('About us clicked');
    // Navigate to about page
  };

  const handleContactClick = () => {
    console.log('Contact us clicked');
    // Navigate to contact page
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    // Allow access to symptom checker and chatbot without login
    if (currentPage === 'symptom-checker') {
      return <SymptomChecker />;
    }
    
    if (currentPage === 'chatbot') {
      return <Chatbot onEmergencyClick={handleEmergencyClick} />;
    }

    if (currentPage === 'homesymptom') {
      return <HomeSymptom 
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
        onHomeClick={handleHomeClick}
      />;
    }

    if (currentPage === 'homebot') {
      return <HomeBot 
        onEmergencyClick={handleEmergencyClick}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onAboutClick={handleAboutClick}
        onContactClick={handleContactClick}
        onHomeClick={handleHomeClick}
      />;
    }
    
    if (!isLoggedIn) {
      return <Home 
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onSymptomCheckerClick={() => setCurrentPage('homesymptom')}
        onChatbotClick={() => setCurrentPage('homebot')}
      />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={handlePageChange} />;
      case 'appointments':
        return <Appointment />;
      case 'health-records':
        return <HealthRecords onExportRecordsClick={handleExportRecordsClick} onAddRecordClick={handleAddRecordClick} />;
      case 'admin':
        return isAdmin ? <Admin /> : <Dashboard onPageChange={handlePageChange} />;
      case 'messages':
        return <Dashboard onPageChange={handlePageChange} />;
      default:
        return <Dashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="App">
      {isLoggedIn && (
        <>
          <Navbar onMessageClick={handleMessageClick} onNotificationClick={handleNotificationClick} onLogout={handleLogout} />
          <Sidebar onPageChange={handlePageChange} currentPage={currentPage} isAdmin={isAdmin} />
        </>
      )}
      <div className="content">
        {renderPage()}
        {isLoggedIn && showChat && selectedDoctor && (
          <Chat doctor={selectedDoctor} onClose={handleCloseChat} />
        )}
        {isLoggedIn && showChatPopup && (
          <ChatPopup onClose={handleCloseChatPopup} onSelectDoctor={handleDoctorSelect} />
        )}
        {isLoggedIn && showNotification && (
          <Notification onClose={handleCloseNotification} />
        )}
        {isLoggedIn && showEmergency && (
          <Emergency onClose={handleCloseEmergency} />
        )}
        {isLoggedIn && showExportRecords && (
          <ExportRecords onClose={handleCloseExportRecords} />
        )}
        {isLoggedIn && showAddRecord && (
          <AddRecord onClose={handleCloseAddRecord} />
        )}
      </div>
      {showLogin && (
        <Login onLogin={handleLogin} onClose={handleCloseLogin} />
      )}
      {showSignup && (
        <Signup onSignup={handleSignupSuccess} onClose={handleCloseSignup} />
      )}
    </div>
  );
}

export default App;
