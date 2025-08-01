import React, { useState } from 'react';
import './signup.css';

const Signup = ({ onSignup, onClose, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) errors.address = 'Address is required';

    // Emergency contact validation - only if any field is filled
    const hasEmergencyContact = formData.emergencyContactName.trim() || 
                               formData.emergencyContactPhone.trim() || 
                               formData.emergencyContactRelationship.trim();
    
    if (hasEmergencyContact) {
      if (!formData.emergencyContactName.trim()) errors.emergencyContactName = 'Emergency contact name is required';
      if (!formData.emergencyContactPhone.trim()) errors.emergencyContactPhone = 'Emergency contact phone is required';
      if (!formData.emergencyContactRelationship.trim()) errors.emergencyContactRelationship = 'Emergency contact relationship is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare emergency contact data
      const emergencyContact = formData.emergencyContactName.trim() ? {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship
      } : null;

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender.toLowerCase(),
          address: {
            street: formData.address,
            city: 'Default City',
            state: 'Default State',
            zipCode: '12345',
            country: 'USA'
          },
          emergencyContact: emergencyContact ? {
            name: emergencyContact.name,
            phoneNumber: emergencyContact.phone,
            relationship: emergencyContact.relationship
          } : {
            name: 'Default Emergency Contact',
            phoneNumber: '+1234567890',
            relationship: 'Other'
          }
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Registration successful! You are now logged in.');
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        onClose();
        // Trigger login callback
        onSignup(data.data.user);
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Registration failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-modal-bg">
      <div className="signup-modal">
        <button className="signup-close" onClick={onClose}>&times;</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
                placeholder="Enter your full name"
              />
              {validationErrors.name && <span className="error">{validationErrors.name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
                placeholder="Enter your email"
              />
              {validationErrors.email && <span className="error">{validationErrors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
                placeholder="Enter your password"
              />
              {validationErrors.password && <span className="error">{validationErrors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
                placeholder="Confirm your password"
              />
              {validationErrors.confirmPassword && <span className="error">{validationErrors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
                placeholder="Enter your phone number"
              />
              {validationErrors.phone && <span className="error">{validationErrors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input 
                type="date" 
                name="dateOfBirth"
                value={formData.dateOfBirth} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
              />
              {validationErrors.dateOfBirth && <span className="error">{validationErrors.dateOfBirth}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender *</label>
              <select 
                name="gender"
                value={formData.gender} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Address *</label>
              <textarea 
                name="address"
                value={formData.address} 
                onChange={handleInputChange} 
                required 
                disabled={isLoading}
                placeholder="Enter your full address"
                rows="3"
              />
              {validationErrors.address && <span className="error">{validationErrors.address}</span>}
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="emergency-contact-section">
            <h3>Emergency Contact (Optional)</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input 
                  type="text" 
                  name="emergencyContactName"
                  value={formData.emergencyContactName} 
                  onChange={handleInputChange} 
                  disabled={isLoading}
                  placeholder="Emergency contact name"
                />
                {validationErrors.emergencyContactName && <span className="error">{validationErrors.emergencyContactName}</span>}
              </div>
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input 
                  type="tel" 
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone} 
                  onChange={handleInputChange} 
                  disabled={isLoading}
                  placeholder="Emergency contact phone"
                />
                {validationErrors.emergencyContactPhone && <span className="error">{validationErrors.emergencyContactPhone}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Relationship</label>
                <select 
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship} 
                  onChange={handleInputChange} 
                  disabled={isLoading}
                >
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
                {validationErrors.emergencyContactRelationship && <span className="error">{validationErrors.emergencyContactRelationship}</span>}
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup; 