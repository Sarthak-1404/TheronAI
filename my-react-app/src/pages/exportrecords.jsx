import React, { useState } from 'react';
import './exportrecords.css';

const ExportRecords = ({ onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedRecords, setSelectedRecords] = useState(['all']);
  const [dateRange, setDateRange] = useState('all');

  const exportFormats = [
    { id: 'pdf', name: 'PDF Document', icon: '📄', description: 'Portable Document Format' },
    { id: 'csv', name: 'CSV File', icon: '📊', description: 'Comma Separated Values' },
    { id: 'json', name: 'JSON File', icon: '📋', description: 'JavaScript Object Notation' },
    { id: 'xml', name: 'XML File', icon: '📝', description: 'Extensible Markup Language' }
  ];

  const recordTypes = [
    { id: 'all', name: 'All Records', icon: '📋' },
    { id: 'medical', name: 'Medical History', icon: '🏥' },
    { id: 'tests', name: 'Test Results', icon: '🔬' },
    { id: 'medications', name: 'Medications', icon: '💊' },
    { id: 'appointments', name: 'Appointments', icon: '📅' }
  ];

  const dateRanges = [
    { id: 'all', name: 'All Time' },
    { id: '1year', name: 'Last 1 Year' },
    { id: '6months', name: 'Last 6 Months' },
    { id: '3months', name: 'Last 3 Months' },
    { id: '1month', name: 'Last 1 Month' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const handleRecordToggle = (recordId) => {
    if (recordId === 'all') {
      setSelectedRecords(['all']);
    } else {
      const newSelection = selectedRecords.includes('all') 
        ? selectedRecords.filter(id => id !== 'all')
        : selectedRecords;
      
      if (newSelection.includes(recordId)) {
        setSelectedRecords(newSelection.filter(id => id !== recordId));
      } else {
        setSelectedRecords([...newSelection, recordId]);
      }
    }
  };

  const handleExport = () => {
    console.log('Exporting records:', {
      format: selectedFormat,
      records: selectedRecords,
      dateRange: dateRange
    });
    
    // Simulate export process
    setTimeout(() => {
      alert(`Exporting ${selectedRecords.length} record types in ${selectedFormat.toUpperCase()} format`);
      onClose();
    }, 1000);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-popup" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <div className="export-icon">📤</div>
          <h2>Export Health Records</h2>
          <p>Select format and records to export</p>
        </div>
        
        <div className="export-content">
          {/* Format Selection */}
          <div className="export-section">
            <h3>Export Format</h3>
            <div className="format-options">
              {exportFormats.map((format) => (
                <div 
                  key={format.id}
                  className={`format-option ${selectedFormat === format.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <div className="format-icon">{format.icon}</div>
                  <div className="format-info">
                    <h4>{format.name}</h4>
                    <p>{format.description}</p>
                  </div>
                  {selectedFormat === format.id && <div className="checkmark">✓</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Record Types Selection */}
          <div className="export-section">
            <h3>Record Types</h3>
            <div className="record-options">
              {recordTypes.map((record) => (
                <div 
                  key={record.id}
                  className={`record-option ${selectedRecords.includes(record.id) ? 'selected' : ''}`}
                  onClick={() => handleRecordToggle(record.id)}
                >
                  <div className="record-icon">{record.icon}</div>
                  <span>{record.name}</span>
                  {selectedRecords.includes(record.id) && <div className="checkmark">✓</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="export-section">
            <h3>Date Range</h3>
            <div className="date-options">
              {dateRanges.map((range) => (
                <div 
                  key={range.id}
                  className={`date-option ${dateRange === range.id ? 'selected' : ''}`}
                  onClick={() => setDateRange(range.id)}
                >
                  <span>{range.name}</span>
                  {dateRange === range.id && <div className="checkmark">✓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="export-footer">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="export-btn" onClick={handleExport}>
            Export Records
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportRecords; 