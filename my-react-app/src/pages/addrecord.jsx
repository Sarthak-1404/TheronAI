import React, { useState } from 'react';
import './addrecord.css';

const AddRecord = ({ onClose }) => {
  const [recordType, setRecordType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    doctor: '',
    description: '',
    notes: '',
    file: null
  });

  const recordTypes = [
    { id: 'medical', name: 'Medical History', icon: '🏥', color: '#3498db' },
    { id: 'test', name: 'Test Results', icon: '🔬', color: '#e74c3c' },
    { id: 'medication', name: 'Medication', icon: '💊', color: '#27ae60' },
    { id: 'appointment', name: 'Appointment', icon: '📅', color: '#f39c12' },
    { id: 'vaccination', name: 'Vaccination', icon: '💉', color: '#9b59b6' },
    { id: 'surgery', name: 'Surgery', icon: '⚕️', color: '#e67e22' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding record:', { recordType, ...formData });
    
    // Simulate record addition
    setTimeout(() => {
      alert('Record added successfully!');
      onClose();
    }, 1000);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="add-record-overlay" onClick={onClose}>
      <div className="add-record-popup" onClick={(e) => e.stopPropagation()}>
        <div className="add-record-header">
          <div className="add-record-icon">📋</div>
          <h2>Add New Record</h2>
          <p>Select record type and fill in the details</p>
        </div>
        
        <div className="add-record-content">
          {/* Record Type Selection */}
          <div className="record-type-section">
            <h3>Record Type</h3>
            <div className="record-type-options">
              {recordTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`record-type-option ${recordType === type.id ? 'selected' : ''}`}
                  onClick={() => setRecordType(type.id)}
                  style={{ borderColor: type.color }}
                >
                  <div className="type-icon" style={{ backgroundColor: type.color }}>
                    {type.icon}
                  </div>
                  <span>{type.name}</span>
                  {recordType === type.id && <div className="checkmark">✓</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Record Form */}
          {recordType && (
            <form className="record-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Record Details</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter record title"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Doctor/Provider</label>
                  <input
                    type="text"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    placeholder="Enter doctor or provider name"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter record description"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Attach File</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <small>Supported formats: PDF, DOC, DOCX, JPG, PNG</small>
                </div>
              </div>
            </form>
          )}
        </div>
        
        <div className="add-record-footer">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          {recordType && (
            <button className="add-btn" onClick={handleSubmit}>
              Add Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddRecord; 