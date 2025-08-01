import React, { useState, useEffect } from 'react';
import './appointment.css';
import Chat from './chat';

const Appointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/doctors');
        const data = await response.json();
        
        if (data.status === 'success') {
          // Transform the data to match the expected format
          const transformedDoctors = data.data.doctors.map((doctor, index) => ({
            id: doctor._id || index + 1,
            name: `${doctor.firstName} ${doctor.lastName}`,
            specialization: doctor.specialization,
            image: doctor.profileImage || `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&v=${index}`,
            description: doctor.bio || `Experienced ${doctor.specialization} with expertise in patient care.`,
            experience: `${doctor.experience?.years || 5}+ years`,
            rating: doctor.rating?.average || 4.5,
            availableSlots: doctor.availableSlots || ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM"]
          }));
          setDoctors(transformedDoctors);
        } else {
          setError('Failed to fetch doctors');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Fallback doctors if API fails
  const fallbackDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      description: "Experienced cardiologist with over 15 years of practice. Specializes in heart disease prevention and treatment.",
      experience: "15+ years",
      rating: 4.8,
      availableSlots: ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM"]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Neurologist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
      description: "Leading neurologist specializing in brain disorders and nervous system conditions. Expert in stroke treatment.",
      experience: "12+ years",
      rating: 4.9,
      availableSlots: ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM"]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Dermatologist",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face",
      description: "Board-certified dermatologist with expertise in skin cancer detection and cosmetic dermatology.",
      experience: "10+ years",
      rating: 4.7,
      availableSlots: ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM"]
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialization: "Orthopedic Surgeon",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      description: "Specialized in joint replacement and sports medicine. Expert in minimally invasive surgical techniques.",
      experience: "18+ years",
      rating: 4.9,
      availableSlots: ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM"]
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialization: "Pediatrician",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
      description: "Dedicated pediatrician with a gentle approach to child healthcare. Specializes in developmental pediatrics.",
      experience: "13+ years",
      rating: 4.8,
      availableSlots: ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM"]
    },
    {
      id: 6,
      name: "Dr. Robert Kim",
      specialization: "Psychiatrist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Experienced psychiatrist specializing in anxiety, depression, and mood disorders. Provides comprehensive mental health care.",
      experience: "14+ years",
      rating: 4.6,
      availableSlots: ["09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", "12:00 PM", "12:45 PM", "01:30 PM", "02:15 PM", "03:00 PM", "03:45 PM", "04:30 PM", "05:15 PM"]
    }
  ];

  // Use fallback doctors if API fails or no doctors found
  const displayDoctors = doctors.length > 0 ? doctors : fallbackDoctors;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth, currentYear);
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonthIndex = today.getMonth();
  const currentYearValue = today.getFullYear();

  const isDateInPast = (day, month, year) => {
    if (year < currentYearValue) return true;
    if (year > currentYearValue) return false;
    if (month < currentMonthIndex) return true;
    if (month > currentMonthIndex) return false;
    return day < currentDay;
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      alert(`Appointment booked with ${selectedDoctor.name} on ${selectedDate} ${monthNames[currentMonth]} at ${selectedTime}`);
      // Here you would typically make an API call to book the appointment
    } else {
      alert("Please select a doctor, date, and time");
    }
  };

  const handleMessageDoctor = () => {
    if (selectedDoctor) {
      setShowChat(true);
    } else {
      alert("Please select a doctor first");
    }
  };

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1>Book an Appointment</h1>
        <p>Select a doctor and schedule your appointment</p>
      </div>

      {/* Doctor Cards Section */}
      <div className="doctors-section">
        <h2>Available Doctors</h2>
        {loading && (
          <div className="loading-message">
            <p>Loading doctors...</p>
          </div>
        )}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        <div className="doctors-grid">
          {displayDoctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="doctor-image">
                <img src={doctor.image} alt={doctor.name} />
              </div>
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialization">{doctor.specialization}</p>
                <div className="doctor-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating">{doctor.rating}</span>
                </div>
              </div>
              <button 
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoctorClick(doctor);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar and Time Slots Section */}
      {selectedDoctor && (
        <div className="calendar-section">
          <h2>Select Date & Time</h2>
          <div className="calendar-time-container">
            {/* Calendar */}
            <div className="calendar-container">
              <div className="calendar-header">
                <div className="calendar-navigation">
                  <button 
                    className="nav-btn"
                    onClick={() => handleMonthChange('prev')}
                  >
                    ‹
                  </button>
                  <h3>{monthNames[currentMonth]} {currentYear}</h3>
                  <button 
                    className="nav-btn"
                    onClick={() => handleMonthChange('next')}
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="calendar-days-header">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
                <div className="calendar-days">
                  {calendarDays.map((day, index) => {
                    const isPast = day && isDateInPast(day, currentMonth, currentYear);
                    return (
                      <div 
                        key={index} 
                        className={`calendar-day ${day ? 'available' : 'empty'} ${isPast ? 'past' : ''} ${selectedDate === day ? 'selected' : ''}`}
                        onClick={() => day && !isPast && setSelectedDate(day)}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="time-slots">
              <h3>Available Times</h3>
              <div className="slots-grid">
                {selectedDoctor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedDoctor && (
        <div className="action-buttons">
          <button 
            className="book-appointment-btn"
            onClick={handleBookAppointment}
            disabled={!selectedDate || !selectedTime}
          >
            Book Appointment
          </button>
          <button 
            className="message-doctor-btn"
            onClick={handleMessageDoctor}
          >
            Message Doctor
          </button>
        </div>
      )}

      {/* Doctor Details Modal */}
      {showDoctorModal && selectedDoctor && (
        <div className="modal-overlay" onClick={() => setShowDoctorModal(false)}>
          <div className="doctor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDoctor.name}</h2>
              <button 
                className="close-modal"
                onClick={() => setShowDoctorModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="modal-doctor-image">
                <img src={selectedDoctor.image} alt={selectedDoctor.name} />
              </div>
              <div className="modal-doctor-info">
                <h3>{selectedDoctor.specialization}</h3>
                <p className="experience">Experience: {selectedDoctor.experience}</p>
                <div className="rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating">{selectedDoctor.rating}</span>
                </div>
                <p className="description">{selectedDoctor.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Component */}
      {showChat && selectedDoctor && (
        <Chat 
          doctor={selectedDoctor} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
};

export default Appointment; 