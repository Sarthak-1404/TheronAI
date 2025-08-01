import React from 'react';
import './Appointments.css';

const Appointments = ({
  doctors,
  selectedDoctor,
  handleDoctorSelect,
  doctorDetailRef,
  calendarDays,
  selectedDate,
  setSelectedDate,
  timeSlots,
  selectedTime,
  setSelectedTime
}) => (
  <div className="appointments-container">
    {/* Patient Concerns Section */}
    <div className="card">
      <h2 className="section-title">Patient Concerns</h2>
      <div className="patient-concerns">
        <p className="concern-description">Red, itchy skin for a week. Worse after sun.</p>
        <p className="symptoms-label">Symptoms:</p>
        <ul className="symptoms-list">
          <li>• Flaky patches</li>
          <li>• Mild burning</li>
          <li>• Skin sensitivity</li>
        </ul>
      </div>
    </div>
    {/* Doctor List Section */}
    <div className="card">
      <h2 className="section-title">Doctor List</h2>
      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div 
            key={doctor.id} 
            onClick={() => handleDoctorSelect(doctor)}
            className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
          >
            <div className="doctor-info">
              <div className="doctor-avatar">
                {doctor.image}
              </div>
              <div className="doctor-details">
                <h3 className="doctor-name">{doctor.name}</h3>
                <div className="doctor-specialty">
                  {doctor.icon}
                  <span>{doctor.specialty}</span>
                </div>
                <div className="doctor-rate">{doctor.rate}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Doctor Detail Section */}
    {selectedDoctor && (
      <div ref={doctorDetailRef} className="card">
        <h2 className="section-title">Doctor Details</h2>
        <div className="doctor-profile">
          <div className="doctor-profile-avatar">
            {selectedDoctor.image}
          </div>
          <h3 className="doctor-profile-name">{selectedDoctor.name}</h3>
          <div className="doctor-profile-specialty">
            {selectedDoctor.icon}
            <span>{selectedDoctor.specialty}</span>
            <span className="doctor-profile-rate">{selectedDoctor.rate}</span>
          </div>
        </div>
        <div className="doctor-info-grid">
          <div className="info-section">
            <h4 className="info-title">
              <span className="info-emoji">🎯</span>
              Experience
            </h4>
            <p className="info-text">
              {selectedDoctor.experience}
            </p>
          </div>
          <div className="info-section">
            <h4 className="info-title">
              <span className="info-emoji">⚕️</span>
              Specialities
            </h4>
            <ul className="specialties-list">
              {selectedDoctor.specialties.map((specialty, index) => (
                <li key={index}>• {specialty}</li>
              ))}
            </ul>
          </div>
          <div className="info-section">
            <h4 className="info-title">Reviews</h4>
            <div className="rating">
              <div className="stars">
                {/* Star icons should be rendered here */}
              </div>
            </div>
            <p className="review-text">
              "{selectedDoctor.review}"
            </p>
          </div>
        </div>
      </div>
    )}
    {/* Calendar and Time Slots Section */}
    {selectedDoctor && (
      <div className="card">
        <h2 className="section-title">Select Date & Time</h2>
        <div className="calendar-container">
          {/* Calendar */}
          <div className="calendar">
            <div className="calendar-header">
              <h3 className="calendar-title">June 2025</h3>
              <div className="calendar-nav">
                <button className="nav-btn">‹</button>
                <button className="nav-btn">›</button>
              </div>
            </div>
            <div className="calendar-weekdays">
              <div className="weekday sunday">Sun</div>
              <div className="weekday">Mon</div>
              <div className="weekday">Tue</div>
              <div className="weekday">Wed</div>
              <div className="weekday">Thu</div>
              <div className="weekday">Fri</div>
              <div className="weekday">Sat</div>
            </div>
            <div className="calendar-days">
              {calendarDays.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date.day)}
                  className={`calendar-day ${selectedDate === date.day ? 'selected' : ''} ${
                    date.day === 1 || date.day === 8 || date.day === 15 || date.day === 22 || date.day === 29
                      ? 'sunday'
                      : ''
                  }`}
                >
                  {date.day}
                </button>
              ))}
            </div>
          </div>
          {/* Time Slots */}
          <div className="time-slots">
            <h4 className="time-slots-title">Available Times - Wed, 4 June 2025</h4>
            <div className="time-slots-grid">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  className={`time-slot ${
                    slot.available
                      ? selectedTime === slot.time
                        ? 'selected'
                        : 'available'
                      : 'unavailable'
                  }`}
                  disabled={!slot.available}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
    {/* Action Buttons */}
    {selectedDoctor && (
      <div className="card">
        <div className="action-buttons">
          <button className="btn btn-primary btn-large">
            Book Appointment
          </button>
          <button className="btn btn-secondary btn-large">
            <span>Message Doctor</span>
          </button>
        </div>
      </div>
    )}
  </div>
);

export default Appointments; 