import React, { useState } from 'react';
import './healthrecords.css';

const HealthRecords = ({ onExportRecordsClick, onAddRecordClick }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Mock data for health records
  const medicalHistory = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Checkup',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Healthy - No issues found',
      notes: 'Regular annual checkup completed. All vital signs normal.',
      status: 'completed'
    },
    {
      id: 2,
      date: '2023-12-10',
      type: 'Consultation',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Seasonal allergies',
      notes: 'Prescribed antihistamines for seasonal allergy symptoms.',
      status: 'completed'
    },
    {
      id: 3,
      date: '2023-11-22',
      type: 'Emergency',
      doctor: 'Dr. Emily Rodriguez',
      diagnosis: 'Minor injury - Sprained ankle',
      notes: 'RICE treatment recommended. Follow-up in 2 weeks.',
      status: 'completed'
    }
  ];

  const testResults = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Blood Test',
      doctor: 'Dr. Sarah Johnson',
      results: {
        'Blood Pressure': '120/80 mmHg',
        'Heart Rate': '72 bpm',
        'Cholesterol': '180 mg/dL',
        'Blood Sugar': '95 mg/dL'
      },
      status: 'normal',
      notes: 'All values within normal range'
    },
    {
      id: 2,
      date: '2023-12-10',
      type: 'X-Ray',
      doctor: 'Dr. Michael Chen',
      results: {
        'Chest X-Ray': 'Normal',
        'Lung Function': 'Good',
        'Heart Size': 'Normal'
      },
      status: 'normal',
      notes: 'No abnormalities detected'
    },
    {
      id: 3,
      date: '2023-11-22',
      type: 'MRI Scan',
      doctor: 'Dr. Emily Rodriguez',
      results: {
        'Ankle MRI': 'Mild sprain',
        'Ligament Status': 'Stable',
        'Bone Structure': 'Normal'
      },
      status: 'minor',
      notes: 'Minor ligament strain, no fracture'
    }
  ];

  const medications = [
    {
      id: 1,
      name: 'Cetirizine',
      dosage: '10mg daily',
      prescribedBy: 'Dr. Michael Chen',
      startDate: '2023-12-10',
      endDate: '2024-03-10',
      status: 'active',
      notes: 'For seasonal allergies'
    },
    {
      id: 2,
      name: 'Ibuprofen',
      dosage: '400mg as needed',
      prescribedBy: 'Dr. Emily Rodriguez',
      startDate: '2023-11-22',
      endDate: '2023-12-22',
      status: 'completed',
      notes: 'For pain relief after ankle injury'
    },
    {
      id: 3,
      name: 'Vitamin D',
      dosage: '1000 IU daily',
      prescribedBy: 'Dr. Sarah Johnson',
      startDate: '2024-01-15',
      endDate: 'Ongoing',
      status: 'active',
      notes: 'Daily supplement for bone health'
    }
  ];

  const appointments = [
    {
      id: 1,
      date: '2024-02-20',
      time: '10:00 AM',
      doctor: 'Dr. Sarah Johnson',
      type: 'Follow-up',
      status: 'scheduled',
      notes: 'Annual checkup follow-up'
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '2:30 PM',
      doctor: 'Dr. Sarah Johnson',
      type: 'Checkup',
      status: 'completed',
      notes: 'Annual physical examination'
    },
    {
      id: 3,
      date: '2023-12-10',
      time: '11:00 AM',
      doctor: 'Dr. Michael Chen',
      type: 'Consultation',
      status: 'completed',
      notes: 'Allergy consultation'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'normal':
        return '#27ae60';
      case 'active':
        return '#3498db';
      case 'scheduled':
        return '#f39c12';
      case 'minor':
        return '#e67e22';
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'normal':
        return 'Normal';
      case 'active':
        return 'Active';
      case 'scheduled':
        return 'Scheduled';
      case 'minor':
        return 'Minor';
      default:
        return status;
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{medicalHistory.length}</h3>
            <p>Medical Records</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔬</div>
          <div className="stat-content">
            <h3>{testResults.length}</h3>
            <p>Test Results</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <h3>{medications.filter(m => m.status === 'active').length}</h3>
            <p>Active Medications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{appointments.filter(a => a.status === 'scheduled').length}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {[...medicalHistory, ...testResults]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((record, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <h4>{record.type}</h4>
                  <p>{record.doctor} • {new Date(record.date).toLocaleDateString()}</p>
                </div>
                <div 
                  className="activity-status"
                  style={{ backgroundColor: getStatusColor(record.status) }}
                >
                  {getStatusText(record.status)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="records-section">
      <div className="records-grid">
        {medicalHistory.map((record) => (
          <div key={record.id} className="record-card" onClick={() => setSelectedRecord(record)}>
            <div className="record-header">
              <div className="record-type">{record.type}</div>
              <div 
                className="record-status"
                style={{ backgroundColor: getStatusColor(record.status) }}
              >
                {getStatusText(record.status)}
              </div>
            </div>
            <div className="record-content">
              <h4>{record.diagnosis}</h4>
              <p className="record-doctor">Dr. {record.doctor}</p>
              <p className="record-date">{new Date(record.date).toLocaleDateString()}</p>
              <p className="record-notes">{record.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTestResults = () => (
    <div className="records-section">
      <div className="records-grid">
        {testResults.map((test) => (
          <div key={test.id} className="record-card" onClick={() => setSelectedRecord(test)}>
            <div className="record-header">
              <div className="record-type">{test.type}</div>
              <div 
                className="record-status"
                style={{ backgroundColor: getStatusColor(test.status) }}
              >
                {getStatusText(test.status)}
              </div>
            </div>
            <div className="record-content">
              <h4>{test.type}</h4>
              <p className="record-doctor">Dr. {test.doctor}</p>
              <p className="record-date">{new Date(test.date).toLocaleDateString()}</p>
              <div className="test-results">
                {Object.entries(test.results).map(([key, value]) => (
                  <div key={key} className="result-item">
                    <span className="result-label">{key}:</span>
                    <span className="result-value">{value}</span>
                  </div>
                ))}
              </div>
              <p className="record-notes">{test.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMedications = () => (
    <div className="records-section">
      <div className="records-grid">
        {medications.map((med) => (
          <div key={med.id} className="record-card" onClick={() => setSelectedRecord(med)}>
            <div className="record-header">
              <div className="record-type">Medication</div>
              <div 
                className="record-status"
                style={{ backgroundColor: getStatusColor(med.status) }}
              >
                {getStatusText(med.status)}
              </div>
            </div>
            <div className="record-content">
              <h4>{med.name}</h4>
              <p className="medication-dosage">{med.dosage}</p>
              <p className="record-doctor">Dr. {med.prescribedBy}</p>
              <p className="record-date">
                {new Date(med.startDate).toLocaleDateString()} - {med.endDate}
              </p>
              <p className="record-notes">{med.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="records-section">
      <div className="records-grid">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="record-card" onClick={() => setSelectedRecord(appointment)}>
            <div className="record-header">
              <div className="record-type">{appointment.type}</div>
              <div 
                className="record-status"
                style={{ backgroundColor: getStatusColor(appointment.status) }}
              >
                {getStatusText(appointment.status)}
              </div>
            </div>
            <div className="record-content">
              <h4>{appointment.type}</h4>
              <p className="record-doctor">Dr. {appointment.doctor}</p>
              <p className="record-date">
                {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
              </p>
              <p className="record-notes">{appointment.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecordDetails = () => {
    if (!selectedRecord) return null;

    return (
      <div className="record-details-modal">
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedRecord.type}</h3>
              <button 
                className="close-modal"
                onClick={() => setSelectedRecord(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-item">
                <label>Date:</label>
                <span>{new Date(selectedRecord.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <label>Doctor:</label>
                <span>Dr. {selectedRecord.doctor}</span>
              </div>
              {selectedRecord.diagnosis && (
                <div className="detail-item">
                  <label>Diagnosis:</label>
                  <span>{selectedRecord.diagnosis}</span>
                </div>
              )}
              {selectedRecord.results && (
                <div className="detail-item">
                  <label>Results:</label>
                  <div className="results-list">
                    {Object.entries(selectedRecord.results).map(([key, value]) => (
                      <div key={key} className="result-detail">
                        <span className="result-label">{key}:</span>
                        <span className="result-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedRecord.dosage && (
                <div className="detail-item">
                  <label>Dosage:</label>
                  <span>{selectedRecord.dosage}</span>
                </div>
              )}
              <div className="detail-item">
                <label>Notes:</label>
                <span>{selectedRecord.notes}</span>
              </div>
              <div className="detail-item">
                <label>Status:</label>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(selectedRecord.status) }}
                >
                  {getStatusText(selectedRecord.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="health-records">
      <div className="records-header">
        <div className="header-content">
          <h1>Health Records</h1>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={onExportRecordsClick}>
            <span>📤</span>
            Export Records
          </button>
          <button className="action-btn" onClick={onAddRecordClick}>
            <span>📋</span>
            Add Record
          </button>
        </div>
      </div>

      <div className="records-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          📋 Medical History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          🔬 Test Results
        </button>
        <button 
          className={`tab-btn ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          💊 Medications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          📅 Appointments
        </button>
      </div>

      <div className="records-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'medical' && renderMedicalHistory()}
        {activeTab === 'tests' && renderTestResults()}
        {activeTab === 'medications' && renderMedications()}
        {activeTab === 'appointments' && renderAppointments()}
      </div>

      {renderRecordDetails()}
    </div>
  );
};

export default HealthRecords;
