import React, { useState, useEffect } from 'react';
import './admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [labs, setLabs] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/doctors');
        const data = await response.json();
        
        if (data.status === 'success') {
          // Transform database doctors to match admin display format
          const transformedDoctors = data.data.doctors.map(doctor => ({
            id: doctor._id,
            name: `${doctor.firstName} ${doctor.lastName}`,
            specialization: doctor.specialization,
            email: doctor.email,
            phone: doctor.phoneNumber,
            experience: doctor.experience?.years?.toString() || '0',
            image: doctor.profileImage || '',
            status: doctor.isActive ? 'active' : 'inactive'
          }));
          setDoctors(transformedDoctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);
  
  // Form states
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    experience: '',
    image: ''
  });
  
  const [labForm, setLabForm] = useState({
    name: '',
    type: '',
    location: '',
    phone: '',
    email: ''
  });
  
  const [slotForm, setSlotForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    duration: '30',
    maxPatients: '1'
  });

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!doctorForm.name.trim()) {
      alert('Please enter doctor name');
      return;
    }
    
    if (!doctorForm.specialization.trim()) {
      alert('Please enter specialization');
      return;
    }
    
    if (!doctorForm.email.trim()) {
      alert('Please enter email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(doctorForm.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    if (!doctorForm.phone.trim()) {
      alert('Please enter phone number');
      return;
    }
    
    // Phone number validation to match backend regex
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(doctorForm.phone.trim())) {
      alert('Please enter a valid phone number (e.g., 1234567890 or +1234567890)');
      return;
    }
    
    if (!doctorForm.experience.trim() || isNaN(parseInt(doctorForm.experience))) {
      alert('Please enter valid experience in years');
      return;
    }
    
    try {
      // Split name into firstName and lastName
      const nameParts = doctorForm.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Validate specialization is in the allowed list
      const allowedSpecializations = [
        'Cardiologist', 'Neurologist', 'Dermatologist', 'Orthopedic Surgeon',
        'Pediatrician', 'Psychiatrist', 'Oncologist', 'Radiologist',
        'Anesthesiologist', 'Emergency Medicine', 'Family Medicine',
        'Internal Medicine', 'Obstetrics and Gynecology', 'Ophthalmologist',
        'Otolaryngologist', 'Pathologist', 'Pulmonologist', 'Rheumatologist',
        'Urologist', 'General Surgeon'
      ];
      
      if (!allowedSpecializations.includes(doctorForm.specialization.trim())) {
        alert('Please select a valid specialization from the list');
        return;
      }
      
      const doctorData = {
        firstName,
        lastName,
        email: doctorForm.email.trim(),
        phoneNumber: doctorForm.phone.trim(),
        specialization: doctorForm.specialization.trim(),
        licenseNumber: `LIC${Date.now()}`, // Generate a unique license number
        experience: {
          years: parseInt(doctorForm.experience) || 0,
          description: `Experienced ${doctorForm.specialization}`
        },
        address: {
          street: '123 Medical Street',
          city: 'Medical City',
          state: 'MC',
          zipCode: '12345',
          country: 'USA'
        },
        consultationFee: 150,
        bio: `Experienced ${doctorForm.specialization} with ${doctorForm.experience} years of practice.`,
        profileImage: doctorForm.image || null,
        languages: ['English']
      };

      console.log('Sending doctor data:', doctorData);
      
      const response = await fetch('http://localhost:5000/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.status === 'success') {
        // Add to local state for display
        const newDoctor = {
          id: data.data.doctor._id,
          name: `${firstName} ${lastName}`,
          specialization: doctorForm.specialization,
          email: doctorForm.email,
          phone: doctorForm.phone,
          experience: doctorForm.experience,
          image: doctorForm.image,
          status: 'active'
        };
        setDoctors([...doctors, newDoctor]);
        
        // Reset form
        setDoctorForm({
          name: '',
          specialization: '',
          email: '',
          phone: '',
          experience: '',
          image: ''
        });
        
        alert('Doctor added successfully!');
      } else {
        // Show specific error message from backend
        let errorMessage = data.message || data.error || 'Failed to add doctor';
        
        // If there are specific validation errors, show them
        if (data.errors && data.errors.length > 0) {
          const errorDetails = data.errors.map(err => `${err.param}: ${err.msg}`).join(', ');
          errorMessage = `Validation failed: ${errorDetails}`;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('Network error: Failed to connect to server. Please try again.');
    }
  };

  const handleLabSubmit = (e) => {
    e.preventDefault();
    
    // Client-side validation for lab
    if (!labForm.name.trim()) {
      alert('Please enter lab name');
      return;
    }
    
    if (!labForm.type.trim()) {
      alert('Please enter lab type');
      return;
    }
    
    if (!labForm.location.trim()) {
      alert('Please enter lab location');
      return;
    }
    
    if (!labForm.phone.trim()) {
      alert('Please enter phone number');
      return;
    }
    
    if (!labForm.email.trim()) {
      alert('Please enter email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(labForm.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    const newLab = {
      id: Date.now(),
      ...labForm,
      status: 'active'
    };
    setLabs([...labs, newLab]);
    setLabForm({
      name: '',
      type: '',
      location: '',
      phone: '',
      email: ''
    });
    
    alert('Lab added successfully!');
  };

  const handleSlotSubmit = (e) => {
    e.preventDefault();
    const newSlot = {
      id: Date.now(),
      ...slotForm,
      status: 'available'
    };
    setSlots([...slots, newSlot]);
    setSlotForm({
      doctorId: '',
      date: '',
      time: '',
      duration: '30',
      maxPatients: '1'
    });
  };

  const deleteDoctor = async (id) => {
    try {
      // For now, just remove from local state
      // In a real app, you'd make a DELETE API call here
      setDoctors(doctors.filter(doctor => doctor.id !== id));
      alert('Doctor removed successfully!');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor');
    }
  };

  const deleteLab = (id) => {
    setLabs(labs.filter(lab => lab.id !== id));
  };

  const deleteSlot = (id) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage doctors, labs, and booking slots</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Doctors
        </button>
        <button 
          className={`tab-button ${activeTab === 'labs' ? 'active' : ''}`}
          onClick={() => setActiveTab('labs')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
            <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
            <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
            <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
          </svg>
          Labs
        </button>
        <button 
          className={`tab-button ${activeTab === 'slots' ? 'active' : ''}`}
          onClick={() => setActiveTab('slots')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Booking Slots
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'doctors' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Add New Doctor</h3>
              <form onSubmit={handleDoctorSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                      required
                    />
                  </div>
                                     <div className="form-group">
                     <label>Specialization</label>
                     <select
                       value={doctorForm.specialization}
                       onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})}
                       required
                     >
                       <option value="">Select Specialization</option>
                       <option value="Cardiologist">Cardiologist</option>
                       <option value="Neurologist">Neurologist</option>
                       <option value="Dermatologist">Dermatologist</option>
                       <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                       <option value="Pediatrician">Pediatrician</option>
                       <option value="Psychiatrist">Psychiatrist</option>
                       <option value="Oncologist">Oncologist</option>
                       <option value="Radiologist">Radiologist</option>
                       <option value="Anesthesiologist">Anesthesiologist</option>
                       <option value="Emergency Medicine">Emergency Medicine</option>
                       <option value="Family Medicine">Family Medicine</option>
                       <option value="Internal Medicine">Internal Medicine</option>
                       <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                       <option value="Ophthalmologist">Ophthalmologist</option>
                       <option value="Otolaryngologist">Otolaryngologist</option>
                       <option value="Pathologist">Pathologist</option>
                       <option value="Pulmonologist">Pulmonologist</option>
                       <option value="Rheumatologist">Rheumatologist</option>
                       <option value="Urologist">Urologist</option>
                       <option value="General Surgeon">General Surgeon</option>
                     </select>
                   </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Experience (years)</label>
                    <input
                      type="number"
                      value={doctorForm.experience}
                      onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={doctorForm.image}
                      onChange={(e) => setDoctorForm({...doctorForm, image: e.target.value})}
                    />
                  </div>
                </div>
                <button type="submit" className="submit-btn">Add Doctor</button>
              </form>
            </div>

            <div className="list-section">
              <h3>Current Doctors</h3>
              <div className="items-grid">
                {doctors.map(doctor => (
                  <div key={doctor.id} className="item-card">
                    <div className="item-header">
                      <h4>{doctor.name}</h4>
                      <button 
                        onClick={() => deleteDoctor(doctor.id)}
                        className="delete-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                      </button>
                    </div>
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Phone:</strong> {doctor.phone}</p>
                    <p><strong>Experience:</strong> {doctor.experience} years</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Add New Lab</h3>
              <form onSubmit={handleLabSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Lab Name</label>
                    <input
                      type="text"
                      value={labForm.name}
                      onChange={(e) => setLabForm({...labForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={labForm.type}
                      onChange={(e) => setLabForm({...labForm, type: e.target.value})}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Diagnostic">Diagnostic</option>
                      <option value="Pathology">Pathology</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Cardiology">Cardiology</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={labForm.location}
                      onChange={(e) => setLabForm({...labForm, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={labForm.phone}
                      onChange={(e) => setLabForm({...labForm, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={labForm.email}
                    onChange={(e) => setLabForm({...labForm, email: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Add Lab</button>
              </form>
            </div>

            <div className="list-section">
              <h3>Current Labs</h3>
              <div className="items-grid">
                {labs.map(lab => (
                  <div key={lab.id} className="item-card">
                    <div className="item-header">
                      <h4>{lab.name}</h4>
                      <button 
                        onClick={() => deleteLab(lab.id)}
                        className="delete-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                      </button>
                    </div>
                    <p><strong>Type:</strong> {lab.type}</p>
                    <p><strong>Location:</strong> {lab.location}</p>
                    <p><strong>Phone:</strong> {lab.phone}</p>
                    <p><strong>Email:</strong> {lab.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'slots' && (
          <div className="tab-content">
            <div className="form-section">
              <h3>Add Booking Slot</h3>
              <form onSubmit={handleSlotSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Doctor</label>
                    <select
                      value={slotForm.doctorId}
                      onChange={(e) => setSlotForm({...slotForm, doctorId: e.target.value})}
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialization}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={slotForm.date}
                      onChange={(e) => setSlotForm({...slotForm, date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={slotForm.time}
                      onChange={(e) => setSlotForm({...slotForm, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes)</label>
                    <select
                      value={slotForm.duration}
                      onChange={(e) => setSlotForm({...slotForm, duration: e.target.value})}
                      required
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Max Patients</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={slotForm.maxPatients}
                    onChange={(e) => setSlotForm({...slotForm, maxPatients: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Add Slot</button>
              </form>
            </div>

            <div className="list-section">
              <h3>Current Booking Slots</h3>
              <div className="items-grid">
                {slots.map(slot => {
                  const doctor = doctors.find(d => d.id == slot.doctorId);
                  return (
                    <div key={slot.id} className="item-card">
                      <div className="item-header">
                        <h4>{doctor ? doctor.name : 'Unknown Doctor'}</h4>
                        <button 
                          onClick={() => deleteSlot(slot.id)}
                          className="delete-btn"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                          </svg>
                        </button>
                      </div>
                      <p><strong>Date:</strong> {slot.date}</p>
                      <p><strong>Time:</strong> {slot.time}</p>
                      <p><strong>Duration:</strong> {slot.duration} minutes</p>
                      <p><strong>Max Patients:</strong> {slot.maxPatients}</p>
                      <p><strong>Status:</strong> <span className={`status ${slot.status}`}>{slot.status}</span></p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin; 