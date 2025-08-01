import React from 'react';
import './condition.css';

const Condition = ({ onNext, onBack, selectedSymptoms }) => {
  const getConditions = (symptoms) => {
    // Comprehensive conditions mapping with probabilities
    const conditions = {
      // General Symptoms
      1: [
        { name: 'Infection', probability: 85 },
        { name: 'Inflammatory disease', probability: 65 },
        { name: 'Cancer', probability: 15 },
        { name: 'Autoimmune disorder', probability: 45 },
        { name: 'Metabolic disorder', probability: 35 }
      ],
      2: [
        { name: 'Chronic fatigue syndrome', probability: 70 },
        { name: 'Anemia', probability: 80 },
        { name: 'Depression', probability: 60 },
        { name: 'Thyroid disorder', probability: 75 },
        { name: 'Chronic disease', probability: 50 }
      ],
      3: [
        { name: 'Tuberculosis', probability: 25 },
        { name: 'Cancer', probability: 20 },
        { name: 'HIV/AIDS', probability: 10 },
        { name: 'Endocrine disorder', probability: 55 },
        { name: 'Infection', probability: 80 }
      ],
      4: [
        { name: 'Cancer', probability: 30 },
        { name: 'Hyperthyroidism', probability: 70 },
        { name: 'Diabetes', probability: 65 },
        { name: 'Depression', probability: 55 },
        { name: 'Eating disorder', probability: 40 }
      ],
      5: [
        { name: 'Gastroenteritis', probability: 75 },
        { name: 'Cancer', probability: 25 },
        { name: 'Depression', probability: 60 },
        { name: 'Anxiety', probability: 70 },
        { name: 'Chronic disease', probability: 45 }
      ],
      
      // Head and Neck
      6: [
        { name: 'Tension headache', probability: 85 },
        { name: 'Migraine', probability: 70 },
        { name: 'Sinusitis', probability: 75 },
        { name: 'Hypertension', probability: 60 },
        { name: 'Brain tumor', probability: 10 }
      ],
      7: [
        { name: 'Vertigo', probability: 80 },
        { name: 'Low blood pressure', probability: 75 },
        { name: 'Anemia', probability: 70 },
        { name: 'Anxiety', probability: 65 },
        { name: 'Inner ear disorder', probability: 60 }
      ],
      8: [
        { name: 'Viral infection', probability: 90 },
        { name: 'Strep throat', probability: 70 },
        { name: 'Allergies', probability: 80 },
        { name: 'GERD', probability: 65 },
        { name: 'Cancer', probability: 15 }
      ],
      9: [
        { name: 'Common cold', probability: 95 },
        { name: 'Allergies', probability: 85 },
        { name: 'Sinusitis', probability: 75 },
        { name: 'Viral infection', probability: 90 },
        { name: 'Environmental irritants', probability: 80 }
      ],
      10: [
        { name: 'Upper respiratory infection', probability: 90 },
        { name: 'Bronchitis', probability: 75 },
        { name: 'Pneumonia', probability: 60 },
        { name: 'Allergies', probability: 80 },
        { name: 'GERD', probability: 65 }
      ],
      11: [
        { name: 'Allergies', probability: 90 },
        { name: 'Common cold', probability: 85 },
        { name: 'Environmental irritants', probability: 80 },
        { name: 'Sinusitis', probability: 70 },
        { name: 'Viral infection', probability: 85 }
      ],
      12: [
        { name: 'Laryngitis', probability: 80 },
        { name: 'GERD', probability: 70 },
        { name: 'Vocal cord nodules', probability: 60 },
        { name: 'Cancer', probability: 20 },
        { name: 'Neurological disorder', probability: 30 }
      ],
      13: [
        { name: 'Infection', probability: 85 },
        { name: 'Cancer', probability: 25 },
        { name: 'Autoimmune disease', probability: 50 },
        { name: 'Tuberculosis', probability: 30 },
        { name: 'HIV/AIDS', probability: 15 }
      ],
      
      // Chest and Respiratory
      14: [
        { name: 'Angina', probability: 70 },
        { name: 'Heart attack', probability: 40 },
        { name: 'Anxiety', probability: 75 },
        { name: 'Muscle strain', probability: 80 },
        { name: 'Pleurisy', probability: 55 }
      ],
      15: [
        { name: 'Asthma', probability: 75 },
        { name: 'COPD', probability: 65 },
        { name: 'Pneumonia', probability: 70 },
        { name: 'Anxiety', probability: 80 },
        { name: 'Heart failure', probability: 45 }
      ],
      16: [
        { name: 'Asthma', probability: 80 },
        { name: 'COPD', probability: 70 },
        { name: 'Bronchitis', probability: 75 },
        { name: 'Allergies', probability: 85 },
        { name: 'Heart failure', probability: 50 }
      ],
      17: [
        { name: 'COPD', probability: 75 },
        { name: 'Bronchitis', probability: 80 },
        { name: 'Tuberculosis', probability: 40 },
        { name: 'Cancer', probability: 30 },
        { name: 'GERD', probability: 70 }
      ],
      18: [
        { name: 'Tuberculosis', probability: 50 },
        { name: 'Cancer', probability: 35 },
        { name: 'Bronchiectasis', probability: 45 },
        { name: 'Pneumonia', probability: 75 },
        { name: 'Pulmonary embolism', probability: 40 }
      ],
      
      // Cardiovascular
      19: [
        { name: 'Anxiety', probability: 85 },
        { name: 'Arrhythmia', probability: 70 },
        { name: 'Hyperthyroidism', probability: 65 },
        { name: 'Anemia', probability: 75 },
        { name: 'Heart disease', probability: 60 }
      ],
      20: [
        { name: 'Hypertension', probability: 80 },
        { name: 'Hypotension', probability: 70 },
        { name: 'Heart disease', probability: 65 },
        { name: 'Endocrine disorder', probability: 60 },
        { name: 'Medication side effect', probability: 75 }
      ],
      21: [
        { name: 'Low blood pressure', probability: 80 },
        { name: 'Heart arrhythmia', probability: 70 },
        { name: 'Neurological disorder', probability: 55 },
        { name: 'Anemia', probability: 75 },
        { name: 'Medication side effect', probability: 80 }
      ],
      
      // Digestive System
      22: [
        { name: 'Gastritis', probability: 85 },
        { name: 'Food poisoning', probability: 80 },
        { name: 'Pregnancy', probability: 40 },
        { name: 'Migraine', probability: 60 },
        { name: 'Medication side effect', probability: 75 }
      ],
      23: [
        { name: 'Gastritis', probability: 80 },
        { name: 'Food poisoning', probability: 85 },
        { name: 'Pregnancy', probability: 35 },
        { name: 'Migraine', probability: 55 },
        { name: 'Intestinal obstruction', probability: 45 }
      ],
      24: [
        { name: 'Gastroenteritis', probability: 90 },
        { name: 'Food poisoning', probability: 85 },
        { name: 'IBS', probability: 70 },
        { name: 'Inflammatory bowel disease', probability: 55 },
        { name: 'Infection', probability: 80 }
      ],
      25: [
        { name: 'IBS', probability: 75 },
        { name: 'Hypothyroidism', probability: 65 },
        { name: 'Medication side effect', probability: 80 },
        { name: 'Dehydration', probability: 70 },
        { name: 'Neurological disorder', probability: 50 }
      ],
      26: [
        { name: 'Appendicitis', probability: 60 },
        { name: 'Gastritis', probability: 80 },
        { name: 'IBS', probability: 75 },
        { name: 'Food poisoning', probability: 85 },
        { name: 'Ulcer', probability: 65 }
      ],
      27: [
        { name: 'IBS', probability: 80 },
        { name: 'Food intolerance', probability: 75 },
        { name: 'Celiac disease', probability: 45 },
        { name: 'Gastritis', probability: 75 },
        { name: 'Medication side effect', probability: 80 }
      ],
      28: [
        { name: 'GERD', probability: 85 },
        { name: 'Hiatal hernia', probability: 70 },
        { name: 'Ulcer', probability: 65 },
        { name: 'Esophagitis', probability: 60 },
        { name: 'Medication side effect', probability: 75 }
      ],
      29: [
        { name: 'Hemorrhoids', probability: 85 },
        { name: 'Colon cancer', probability: 25 },
        { name: 'Ulcerative colitis', probability: 45 },
        { name: 'Crohn\'s disease', probability: 40 },
        { name: 'Anal fissure', probability: 75 }
      ],
      
      // Neurological
      30: [
        { name: 'Dementia', probability: 40 },
        { name: 'Alzheimer\'s disease', probability: 35 },
        { name: 'Depression', probability: 70 },
        { name: 'Medication side effect', probability: 80 },
        { name: 'Brain injury', probability: 30 }
      ],
      31: [
        { name: 'Diabetes', probability: 75 },
        { name: 'Multiple sclerosis', probability: 35 },
        { name: 'Carpal tunnel syndrome', probability: 70 },
        { name: 'Vitamin deficiency', probability: 65 },
        { name: 'Neurological disorder', probability: 55 }
      ],
      32: [
        { name: 'Epilepsy', probability: 50 },
        { name: 'Brain injury', probability: 40 },
        { name: 'Brain tumor', probability: 20 },
        { name: 'Stroke', probability: 45 },
        { name: 'Metabolic disorder', probability: 60 }
      ],
      33: [
        { name: 'Essential tremor', probability: 70 },
        { name: 'Parkinson\'s disease', probability: 35 },
        { name: 'Multiple sclerosis', probability: 40 },
        { name: 'Medication side effect', probability: 75 },
        { name: 'Neurological disorder', probability: 50 }
      ],
      34: [
        { name: 'Inner ear disorder', probability: 75 },
        { name: 'Neurological disorder', probability: 55 },
        { name: 'Medication side effect', probability: 80 },
        { name: 'Brain injury', probability: 35 },
        { name: 'Multiple sclerosis', probability: 40 }
      ],
      35: [
        { name: 'Diabetes', probability: 80 },
        { name: 'Multiple sclerosis', probability: 45 },
        { name: 'Stroke', probability: 50 },
        { name: 'Brain tumor', probability: 25 },
        { name: 'Neurological disorder', probability: 55 }
      ],
      36: [
        { name: 'Stroke', probability: 55 },
        { name: 'Brain tumor', probability: 30 },
        { name: 'Multiple sclerosis', probability: 45 },
        { name: 'Neurological disorder', probability: 60 },
        { name: 'Medication side effect', probability: 75 }
      ],
      
      // Muscle and Joint
      37: [
        { name: 'Fibromyalgia', probability: 70 },
        { name: 'Influenza', probability: 85 },
        { name: 'Autoimmune disease', probability: 55 },
        { name: 'Vitamin D deficiency', probability: 65 },
        { name: 'Chronic fatigue syndrome', probability: 60 }
      ],
      38: [
        { name: 'Arthritis', probability: 75 },
        { name: 'Autoimmune disease', probability: 60 },
        { name: 'Injury', probability: 80 },
        { name: 'Fibromyalgia', probability: 65 },
        { name: 'Infection', probability: 70 }
      ],
      39: [
        { name: 'Arthritis', probability: 80 },
        { name: 'Autoimmune disease', probability: 65 },
        { name: 'Infection', probability: 75 },
        { name: 'Injury', probability: 85 },
        { name: 'Gout', probability: 60 }
      ],
      
      // Skin and Hair
      40: [
        { name: 'Allergic reaction', probability: 90 },
        { name: 'Eczema', probability: 75 },
        { name: 'Psoriasis', probability: 65 },
        { name: 'Infection', probability: 80 },
        { name: 'Autoimmune disease', probability: 55 }
      ],
      41: [
        { name: 'Allergic reaction', probability: 85 },
        { name: 'Liver disease', probability: 45 },
        { name: 'Kidney disease', probability: 50 },
        { name: 'Diabetes', probability: 70 },
        { name: 'Parasitic infection', probability: 60 }
      ],
      42: [
        { name: 'Alopecia', probability: 65 },
        { name: 'Thyroid disorder', probability: 75 },
        { name: 'Autoimmune disease', probability: 60 },
        { name: 'Nutritional deficiency', probability: 70 },
        { name: 'Medication side effect', probability: 80 }
      ],
      43: [
        { name: 'Eczema', probability: 80 },
        { name: 'Psoriasis', probability: 70 },
        { name: 'Allergic reaction', probability: 85 },
        { name: 'Nutritional deficiency', probability: 65 },
        { name: 'Autoimmune disease', probability: 55 }
      ],
      44: [
        { name: 'Liver disease', probability: 50 },
        { name: 'Jaundice', probability: 60 },
        { name: 'Autoimmune disease', probability: 55 },
        { name: 'Cancer', probability: 30 },
        { name: 'Medication side effect', probability: 75 }
      ],
      
      // Mental and Emotional
      45: [
        { name: 'Generalized anxiety disorder', probability: 80 },
        { name: 'Panic disorder', probability: 70 },
        { name: 'Depression', probability: 75 },
        { name: 'Stress', probability: 90 },
        { name: 'Medication side effect', probability: 85 }
      ],
      46: [
        { name: 'Major depressive disorder', probability: 75 },
        { name: 'Bipolar disorder', probability: 55 },
        { name: 'Seasonal affective disorder', probability: 65 },
        { name: 'Chronic disease', probability: 60 },
        { name: 'Medication side effect', probability: 80 }
      ],
      47: [
        { name: 'Bipolar disorder', probability: 60 },
        { name: 'Premenstrual syndrome', probability: 75 },
        { name: 'Hormonal imbalance', probability: 70 },
        { name: 'Medication side effect', probability: 85 },
        { name: 'Chronic disease', probability: 55 }
      ],
      48: [
        { name: 'Insomnia', probability: 85 },
        { name: 'Anxiety', probability: 80 },
        { name: 'Depression', probability: 75 },
        { name: 'Sleep apnea', probability: 65 },
        { name: 'Medication side effect', probability: 90 }
      ]
    };
    
    const conditionMap = new Map();
    
    selectedSymptoms.forEach(symptomId => {
      if (conditions[symptomId]) {
        conditions[symptomId].forEach(condition => {
          if (conditionMap.has(condition.name)) {
            // If condition already exists, increase probability
            const existing = conditionMap.get(condition.name);
            existing.probability = Math.min(95, existing.probability + 10);
            existing.count++;
          } else {
            conditionMap.set(condition.name, {
              name: condition.name,
              probability: condition.probability,
              count: 1
            });
          }
        });
      }
    });
    
    return Array.from(conditionMap.values()).sort((a, b) => b.probability - a.probability);
  };

  const conditions = getConditions(selectedSymptoms);

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return '#e74c3c'; // High - Red
    if (probability >= 60) return '#f39c12'; // Medium - Orange
    return '#27ae60'; // Low - Green
  };

  const getProbabilityText = (probability) => {
    if (probability >= 80) return 'High';
    if (probability >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="step-container">
      <div className="conditions-container">
        {/* Step header inside scrollable container */}
        <div className="step-header">
          <h2>Possible Conditions</h2>
        </div>
        
        <div className="conditions-list">
          {conditions.map((condition, index) => (
            <div key={index} className="condition-card">
              <div className="condition-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                  <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                </svg>
              </div>
              <div className="condition-info">
                <h4>{condition.name}</h4>
                <div className="probability-section">
                  <div className="probability-bar">
                    <div 
                      className="probability-fill" 
                      style={{ 
                        width: `${condition.probability}%`,
                        backgroundColor: getProbabilityColor(condition.probability)
                      }}
                    ></div>
                  </div>
                  <div className="probability-details">
                    <span className="probability-text">{getProbabilityText(condition.probability)}</span>
                    <span className="probability-percentage">{condition.probability}%</span>
                  </div>
                </div>
                <p>Based on {condition.count} symptom{condition.count > 1 ? 's' : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="step-actions">
        <button className="back-btn" onClick={onBack}>Back</button>
        <button className="continue-btn" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
};

export default Condition;
