import React, { useState } from 'react';
import './symptomchecker.css';
import Info from '../components/info';
import Symptom from '../components/symptom';
import Condition from '../components/condition';
import Details from '../components/details';
import Treatment from '../components/treatment';

const SymptomChecker = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({});
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const steps = [
    { name: 'Info', component: Info },
    { name: 'Symptom', component: Symptom },
    { name: 'Conditions', component: Condition },
    { name: 'Details', component: Details },
    { name: 'Treatment', component: Treatment }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // Reset to the first step (Info)
    setCurrentStep(0);
    // Optionally clear the data to start fresh
    setUserData({});
    setSelectedSymptoms([]);
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="symptom-checker">
      
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
              onClick={() => handleStepClick(index)}
            >
              <div className="step-number">{index + 1}</div>
              <span className="step-name">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="step-content">
        <CurrentStepComponent
          onNext={handleNext}
          onBack={handleBack}
          onFinish={handleFinish}
          userData={userData}
          setUserData={setUserData}
          selectedSymptoms={selectedSymptoms}
          setSelectedSymptoms={setSelectedSymptoms}
        />
      </div>
    </div>
  );
};

export default SymptomChecker;
