import React from 'react';
import './symptom.css';

const Symptom = ({ onNext, onBack, selectedSymptoms, setSelectedSymptoms }) => {
  const symptoms = [
    // General Symptoms
    { id: 1, name: 'Fever or chills', category: 'General' },
    { id: 2, name: 'Fatigue or weakness', category: 'General' },
    { id: 3, name: 'Sweating (especially night sweats)', category: 'General' },
    { id: 4, name: 'Weight loss or gain (unexplained)', category: 'General' },
    { id: 5, name: 'Loss of appetite', category: 'General' },
    
    // Head and Neck
    { id: 6, name: 'Headache', category: 'Head and Neck' },
    { id: 7, name: 'Dizziness or lightheadedness', category: 'Head and Neck' },
    { id: 8, name: 'Sore throat', category: 'Head and Neck' },
    { id: 9, name: 'Runny or stuffy nose', category: 'Head and Neck' },
    { id: 10, name: 'Cough (dry or wet)', category: 'Head and Neck' },
    { id: 11, name: 'Sneezing', category: 'Head and Neck' },
    { id: 12, name: 'Hoarseness or voice change', category: 'Head and Neck' },
    { id: 13, name: 'Swollen lymph nodes', category: 'Head and Neck' },
    
    // Chest and Respiratory
    { id: 14, name: 'Chest pain', category: 'Chest and Respiratory' },
    { id: 15, name: 'Shortness of breath', category: 'Chest and Respiratory' },
    { id: 16, name: 'Wheezing', category: 'Chest and Respiratory' },
    { id: 17, name: 'Persistent cough', category: 'Chest and Respiratory' },
    { id: 18, name: 'Coughing up blood', category: 'Chest and Respiratory' },
    
    // Cardiovascular
    { id: 19, name: 'Palpitations (irregular or fast heartbeat)', category: 'Cardiovascular' },
    { id: 20, name: 'High or low blood pressure', category: 'Cardiovascular' },
    { id: 21, name: 'Fainting or blackouts', category: 'Cardiovascular' },
    
    // Digestive System
    { id: 22, name: 'Nausea', category: 'Digestive System' },
    { id: 23, name: 'Vomiting', category: 'Digestive System' },
    { id: 24, name: 'Diarrhea', category: 'Digestive System' },
    { id: 25, name: 'Constipation', category: 'Digestive System' },
    { id: 26, name: 'Abdominal pain or cramps', category: 'Digestive System' },
    { id: 27, name: 'Bloating', category: 'Digestive System' },
    { id: 28, name: 'Heartburn', category: 'Digestive System' },
    { id: 29, name: 'Blood in stool', category: 'Digestive System' },
    
    // Neurological
    { id: 30, name: 'Confusion or memory loss', category: 'Neurological' },
    { id: 31, name: 'Numbness or tingling', category: 'Neurological' },
    { id: 32, name: 'Seizures', category: 'Neurological' },
    { id: 33, name: 'Tremors', category: 'Neurological' },
    { id: 34, name: 'Balance problems', category: 'Neurological' },
    { id: 35, name: 'Vision changes', category: 'Neurological' },
    { id: 36, name: 'Speech difficulties', category: 'Neurological' },
    
    // Muscle and Joint
    { id: 37, name: 'Muscle aches or pain', category: 'Muscle and Joint' },
    { id: 38, name: 'Joint pain or stiffness', category: 'Muscle and Joint' },
    { id: 39, name: 'Swelling or redness in joints', category: 'Muscle and Joint' },
    
    // Skin and Hair
    { id: 40, name: 'Rashes', category: 'Skin and Hair' },
    { id: 41, name: 'Itching', category: 'Skin and Hair' },
    { id: 42, name: 'Hair loss', category: 'Skin and Hair' },
    { id: 43, name: 'Dry or flaky skin', category: 'Skin and Hair' },
    { id: 44, name: 'Changes in skin color', category: 'Skin and Hair' },
    
    // Mental and Emotional
    { id: 45, name: 'Anxiety', category: 'Mental and Emotional' },
    { id: 46, name: 'Depression', category: 'Mental and Emotional' },
    { id: 47, name: 'Mood swings', category: 'Mental and Emotional' },
    { id: 48, name: 'Insomnia or difficulty sleeping', category: 'Mental and Emotional' }
  ];

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleContinue = () => {
    if (selectedSymptoms.length > 0) {
      onNext();
    }
  };

  // Group symptoms by category for better organization
  const groupedSymptoms = symptoms.reduce((groups, symptom) => {
    const category = symptom.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(symptom);
    return groups;
  }, {});

  return (
    <div className="step-container">
      <div className="symptoms-container">
        {/* Step header inside scrollable container */}
        <div className="step-header">
          <h2>Select Your Symptoms</h2>
        </div>
        
        {Object.entries(groupedSymptoms).map(([category, categorySymptoms]) => (
          <div key={category} className="symptom-category">
            <h3 className="category-title">{category}</h3>
            <div className="symptoms-grid">
              {categorySymptoms.map(symptom => (
                <div
                  key={symptom.id}
                  className={`symptom-card ${selectedSymptoms.includes(symptom.id) ? 'selected' : ''}`}
                  onClick={() => toggleSymptom(symptom.id)}
                >
                  <div className="symptom-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 12l3 3 5-5"></path>
                    </svg>
                  </div>
                  <div className="symptom-info">
                    <h4>{symptom.name}</h4>
                    <span className="category">{symptom.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="step-actions">
        <button className="back-btn" onClick={onBack}>Back</button>
        <button 
          className="continue-btn"
          onClick={handleContinue}
          disabled={selectedSymptoms.length === 0}
        >
          Continue ({selectedSymptoms.length} selected)
        </button>
      </div>
    </div>
  );
};

export default Symptom;
