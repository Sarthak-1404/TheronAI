import React from 'react';
import './treatment.css';

const Treatment = ({ onBack, onFinish, selectedSymptoms }) => {
  const getTreatment = (symptomId) => {
    const treatments = {
      1: {
        name: 'Fever or chills',
        medications: ['Acetaminophen (Tylenol)', 'Ibuprofen (Advil)', 'Aspirin'],
        homeRemedies: ['Rest and hydration', 'Cool compresses', 'Light clothing'],
        lifestyleChanges: ['Monitor temperature', 'Stay hydrated', 'Get adequate rest'],
        medicalHelp: 'Seek immediate care if temperature exceeds 103°F or persists for more than 3 days'
      },
      2: {
        name: 'Fatigue or weakness',
        medications: ['Iron supplements', 'Vitamin B12', 'Thyroid medication'],
        homeRemedies: ['Adequate sleep', 'Balanced diet', 'Gentle exercise'],
        lifestyleChanges: ['Regular sleep schedule', 'Stress management', 'Regular check-ups'],
        medicalHelp: 'Consult doctor if fatigue persists for more than 2 weeks or is severe'
      },
      3: {
        name: 'Sweating (especially night sweats)',
        medications: ['Antiperspirants', 'Hormone therapy', 'Antidepressants'],
        homeRemedies: ['Cool bedroom temperature', 'Light bedding', 'Cotton clothing'],
        lifestyleChanges: ['Avoid spicy foods', 'Reduce alcohol', 'Manage stress'],
        medicalHelp: 'Seek evaluation if accompanied by weight loss or other symptoms'
      },
      4: {
        name: 'Weight loss or gain (unexplained)',
        medications: ['Thyroid medication', 'Diabetes medication', 'Appetite stimulants'],
        homeRemedies: ['Balanced nutrition', 'Regular meals', 'Food diary'],
        lifestyleChanges: ['Regular exercise', 'Stress management', 'Medical monitoring'],
        medicalHelp: 'Immediate evaluation required for unexplained weight loss of more than 10 pounds'
      },
      5: {
        name: 'Loss of appetite',
        medications: ['Appetite stimulants', 'Anti-nausea medication', 'Nutritional supplements'],
        homeRemedies: ['Small frequent meals', 'Appetizing foods', 'Ginger tea'],
        lifestyleChanges: ['Regular meal times', 'Stress reduction', 'Social eating'],
        medicalHelp: 'Seek care if appetite loss persists for more than 1 week'
      }
    };
    
    return treatments[symptomId] || {
      name: 'Symptom',
      medications: ['Consult healthcare provider'],
      homeRemedies: ['Rest and hydration'],
      lifestyleChanges: ['Regular check-ups'],
      medicalHelp: 'Consult a healthcare provider for proper evaluation'
    };
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <div className="step-container">
      <div className="treatment-container">
        {/* Step header inside scrollable container */}
        <div className="step-header">
          <h2>Treatment Recommendations</h2>
          <p>Comprehensive treatment options for your selected symptoms</p>
        </div>
        
        <div className="treatment-section">
          {selectedSymptoms.map((symptomId) => {
            const treatment = getTreatment(symptomId);
            return (
              <div key={symptomId} className="treatment-card">
                <div className="treatment-header">
                  <h3>{treatment.name}</h3>
                </div>
                
                <div className="treatment-grid">
                  <div className="treatment-category">
                    <h4>Medications</h4>
                    <ul>
                      {treatment.medications.map((med, index) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="treatment-category">
                    <h4>Home Remedies</h4>
                    <ul>
                      {treatment.homeRemedies.map((remedy, index) => (
                        <li key={index}>{remedy}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="treatment-category">
                    <h4>Lifestyle Changes</h4>
                    <ul>
                      {treatment.lifestyleChanges.map((change, index) => (
                        <li key={index}>{change}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="warning-section">
                  <h4>When to Seek Medical Help</h4>
                  <p>{treatment.medicalHelp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="step-actions">
        <button className="back-btn" onClick={onBack}>Back</button>
        <button className="finish-btn" onClick={handleFinish}>Finish</button>
      </div>
    </div>
  );
};

export default Treatment; 