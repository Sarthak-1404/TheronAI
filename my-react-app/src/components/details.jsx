import React, { useState } from 'react';
import HumanBody3D from './3d.jsx';
import './details.css';

const Details = ({ onNext, onBack, selectedSymptoms }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);

  const getSymptomDetails = (symptomId) => {
    const details = {
      // General Symptoms
      1: {
        name: 'Fever or chills',
        description: 'Elevated body temperature above normal range, often accompanied by shivering or feeling cold.',
        severity: 'high',
        duration: 'Can last from a few hours to several days',
        warning: 'Seek immediate medical attention if temperature exceeds 103°F (39.4°C) or persists for more than 3 days.',
        bodyParts: ['head', 'chest', 'torso'],
        affectedParts: ['head', 'neck', 'chest', 'torso', 'abdomen'],
        outcomes: [
          { condition: 'Infection', probability: 85, risk: 'High' },
          { condition: 'Inflammatory disease', probability: 65, risk: 'Medium' },
          { condition: 'Cancer', probability: 15, risk: 'Low' }
        ]
      },
      2: {
        name: 'Fatigue or weakness',
        description: 'Persistent feeling of tiredness and lack of energy that interferes with daily activities.',
        severity: 'medium',
        duration: 'Can be acute (days) or chronic (weeks to months)',
        warning: 'Consult a doctor if fatigue persists for more than 2 weeks or is accompanied by other symptoms.',
        bodyParts: ['head', 'arms', 'legs'],
        affectedParts: ['head', 'arms', 'hands', 'legs', 'feet'],
        outcomes: [
          { condition: 'Chronic fatigue syndrome', probability: 70, risk: 'Medium' },
          { condition: 'Anemia', probability: 80, risk: 'High' },
          { condition: 'Depression', probability: 60, risk: 'Medium' }
        ]
      },
      3: {
        name: 'Sweating (especially night sweats)',
        description: 'Excessive sweating, particularly during sleep, often soaking through clothing or bedding.',
        severity: 'medium',
        duration: 'Can occur intermittently over weeks to months',
        warning: 'Night sweats with weight loss may indicate serious conditions requiring immediate evaluation.',
        bodyParts: ['chest', 'back', 'torso'],
        affectedParts: ['chest', 'back', 'torso', 'abdomen', 'arms', 'legs'],
        outcomes: [
          { condition: 'Tuberculosis', probability: 25, risk: 'Low' },
          { condition: 'Cancer', probability: 20, risk: 'Low' },
          { condition: 'HIV/AIDS', probability: 10, risk: 'Low' }
        ]
      },
      4: {
        name: 'Weight loss or gain (unexplained)',
        description: 'Significant changes in body weight without intentional diet or exercise changes.',
        severity: 'high',
        duration: 'Gradual changes over weeks to months',
        warning: 'Unexplained weight loss of more than 10 pounds requires immediate medical evaluation.',
        bodyParts: ['torso', 'abdomen'],
        affectedParts: ['torso', 'abdomen', 'chest', 'arms', 'legs'],
        outcomes: [
          { condition: 'Cancer', probability: 30, risk: 'Low' },
          { condition: 'Hyperthyroidism', probability: 70, risk: 'Medium' },
          { condition: 'Diabetes', probability: 65, risk: 'Medium' }
        ]
      },
      5: {
        name: 'Loss of appetite',
        description: 'Decreased desire to eat, often accompanied by reduced food intake.',
        severity: 'medium',
        duration: 'Can be acute (days) or chronic (weeks)',
        warning: 'Prolonged loss of appetite may lead to malnutrition and requires medical attention.',
        bodyParts: ['abdomen', 'chest'],
        affectedParts: ['abdomen', 'chest', 'torso'],
        outcomes: [
          { condition: 'Gastroenteritis', probability: 75, risk: 'Medium' },
          { condition: 'Cancer', probability: 25, risk: 'Low' },
          { condition: 'Depression', probability: 60, risk: 'Medium' }
        ]
      },
      
      // Head and Neck Symptoms
      6: {
        name: 'Headache',
        description: 'Pain or discomfort in the head, scalp, or neck area.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe headache with neurological symptoms requires immediate attention.',
        bodyParts: ['head'],
        affectedParts: ['head', 'neck'],
        outcomes: [
          { condition: 'Tension headache', probability: 80, risk: 'High' },
          { condition: 'Migraine', probability: 60, risk: 'Medium' },
          { condition: 'Brain tumor', probability: 5, risk: 'Low' }
        ]
      },
      7: {
        name: 'Dizziness or lightheadedness',
        description: 'Sensation of spinning or feeling faint.',
        severity: 'medium',
        duration: 'Can be brief or persistent',
        warning: 'Dizziness with chest pain or neurological symptoms is urgent.',
        bodyParts: ['head'],
        affectedParts: ['head', 'neck'],
        outcomes: [
          { condition: 'Inner ear disorder', probability: 70, risk: 'Medium' },
          { condition: 'Low blood pressure', probability: 60, risk: 'Medium' },
          { condition: 'Stroke', probability: 10, risk: 'Low' }
        ]
      },
      8: {
        name: 'Sore throat',
        description: 'Pain, scratchiness, or irritation in the throat.',
        severity: 'medium',
        duration: 'Usually 3-7 days',
        warning: 'Severe sore throat with difficulty breathing requires immediate care.',
        bodyParts: ['head', 'neck'],
        affectedParts: ['head', 'neck'],
        outcomes: [
          { condition: 'Viral infection', probability: 80, risk: 'High' },
          { condition: 'Strep throat', probability: 30, risk: 'Low' },
          { condition: 'Tonsillitis', probability: 25, risk: 'Low' }
        ]
      },
      9: {
        name: 'Runny or stuffy nose',
        description: 'Excess nasal discharge or nasal congestion.',
        severity: 'low',
        duration: 'Usually 7-10 days',
        warning: 'Persistent symptoms may indicate sinus infection.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Common cold', probability: 85, risk: 'High' },
          { condition: 'Allergies', probability: 60, risk: 'Medium' },
          { condition: 'Sinus infection', probability: 20, risk: 'Low' }
        ]
      },
      10: {
        name: 'Cough (dry or wet)',
        description: 'Sudden expulsion of air from the lungs.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Cough with blood or chest pain requires immediate evaluation.',
        bodyParts: ['chest', 'head'],
        affectedParts: ['chest', 'head', 'neck'],
        outcomes: [
          { condition: 'Upper respiratory infection', probability: 75, risk: 'Medium' },
          { condition: 'Bronchitis', probability: 40, risk: 'Low' },
          { condition: 'Pneumonia', probability: 15, risk: 'Low' }
        ]
      },
      11: {
        name: 'Sneezing',
        description: 'Sudden, involuntary expulsion of air through the nose.',
        severity: 'low',
        duration: 'Usually brief episodes',
        warning: 'Persistent sneezing may indicate allergies.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Allergies', probability: 80, risk: 'High' },
          { condition: 'Common cold', probability: 70, risk: 'Medium' },
          { condition: 'Sinus infection', probability: 15, risk: 'Low' }
        ]
      },
      12: {
        name: 'Hoarseness or voice change',
        description: 'Abnormal voice quality or difficulty speaking.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Persistent hoarseness may indicate serious conditions.',
        bodyParts: ['head', 'neck'],
        affectedParts: ['head', 'neck'],
        outcomes: [
          { condition: 'Laryngitis', probability: 70, risk: 'Medium' },
          { condition: 'Vocal cord nodules', probability: 30, risk: 'Low' },
          { condition: 'Laryngeal cancer', probability: 5, risk: 'Low' }
        ]
      },
      13: {
        name: 'Swollen lymph nodes',
        description: 'Enlarged lymph nodes, often in neck, armpits, or groin.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Persistent swelling may indicate serious infection or cancer.',
        bodyParts: ['head', 'neck', 'arms'],
        affectedParts: ['head', 'neck', 'arms', 'chest'],
        outcomes: [
          { condition: 'Infection', probability: 75, risk: 'Medium' },
          { condition: 'Lymphoma', probability: 10, risk: 'Low' },
          { condition: 'Metastatic cancer', probability: 5, risk: 'Low' }
        ]
      },
      
      // Chest and Respiratory Symptoms
      14: {
        name: 'Chest pain',
        description: 'Pain or discomfort in the chest area.',
        severity: 'high',
        duration: 'Can be acute or chronic',
        warning: 'Chest pain with shortness of breath requires immediate emergency care.',
        bodyParts: ['chest'],
        affectedParts: ['chest', 'back'],
        outcomes: [
          { condition: 'Angina', probability: 40, risk: 'Low' },
          { condition: 'Heart attack', probability: 20, risk: 'Low' },
          { condition: 'Pneumonia', probability: 30, risk: 'Low' }
        ]
      },
      15: {
        name: 'Shortness of breath',
        description: 'Difficulty breathing or feeling breathless.',
        severity: 'high',
        duration: 'Can be acute or chronic',
        warning: 'Sudden shortness of breath requires immediate medical attention.',
        bodyParts: ['chest'],
        affectedParts: ['chest', 'back'],
        outcomes: [
          { condition: 'Asthma', probability: 50, risk: 'Low' },
          { condition: 'Pneumonia', probability: 30, risk: 'Low' },
          { condition: 'Heart failure', probability: 20, risk: 'Low' }
        ]
      },
      16: {
        name: 'Wheezing',
        description: 'High-pitched whistling sound during breathing.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe wheezing with difficulty breathing is urgent.',
        bodyParts: ['chest'],
        affectedParts: ['chest'],
        outcomes: [
          { condition: 'Asthma', probability: 70, risk: 'Medium' },
          { condition: 'Bronchitis', probability: 40, risk: 'Low' },
          { condition: 'COPD', probability: 20, risk: 'Low' }
        ]
      },
      17: {
        name: 'Persistent cough',
        description: 'Cough that lasts for weeks or months.',
        severity: 'medium',
        duration: 'Chronic (weeks to months)',
        warning: 'Persistent cough with blood requires immediate evaluation.',
        bodyParts: ['chest', 'head'],
        affectedParts: ['chest', 'head', 'neck'],
        outcomes: [
          { condition: 'Chronic bronchitis', probability: 60, risk: 'Medium' },
          { condition: 'Tuberculosis', probability: 10, risk: 'Low' },
          { condition: 'Lung cancer', probability: 5, risk: 'Low' }
        ]
      },
      18: {
        name: 'Coughing up blood',
        description: 'Blood in sputum or coughing up blood.',
        severity: 'high',
        duration: 'Requires immediate attention',
        warning: 'This is a medical emergency requiring immediate care.',
        bodyParts: ['chest'],
        affectedParts: ['chest'],
        outcomes: [
          { condition: 'Bronchitis', probability: 40, risk: 'Low' },
          { condition: 'Tuberculosis', probability: 30, risk: 'Low' },
          { condition: 'Lung cancer', probability: 20, risk: 'Low' }
        ]
      },
      
      // Cardiovascular Symptoms
      19: {
        name: 'Palpitations (irregular or fast heartbeat)',
        description: 'Sensation of heart racing, fluttering, or skipping beats.',
        severity: 'medium',
        duration: 'Can be brief or persistent',
        warning: 'Palpitations with chest pain or fainting require immediate care.',
        bodyParts: ['chest'],
        affectedParts: ['chest'],
        outcomes: [
          { condition: 'Anxiety', probability: 60, risk: 'Medium' },
          { condition: 'Arrhythmia', probability: 30, risk: 'Low' },
          { condition: 'Heart disease', probability: 20, risk: 'Low' }
        ]
      },
      20: {
        name: 'High or low blood pressure',
        description: 'Abnormal blood pressure readings.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe hypertension or hypotension requires immediate attention.',
        bodyParts: ['chest', 'head'],
        affectedParts: ['chest', 'head'],
        outcomes: [
          { condition: 'Hypertension', probability: 70, risk: 'Medium' },
          { condition: 'Heart disease', probability: 40, risk: 'Low' },
          { condition: 'Kidney disease', probability: 20, risk: 'Low' }
        ]
      },
      21: {
        name: 'Fainting or blackouts',
        description: 'Temporary loss of consciousness.',
        severity: 'high',
        duration: 'Usually brief episodes',
        warning: 'Fainting with chest pain or neurological symptoms is urgent.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Vasovagal syncope', probability: 60, risk: 'Medium' },
          { condition: 'Heart arrhythmia', probability: 20, risk: 'Low' },
          { condition: 'Neurological disorder', probability: 15, risk: 'Low' }
        ]
      },
      
      // Digestive System Symptoms
      22: {
        name: 'Nausea',
        description: 'Feeling of sickness with urge to vomit.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe nausea with abdominal pain requires evaluation.',
        bodyParts: ['abdomen'],
        affectedParts: ['abdomen', 'chest'],
        outcomes: [
          { condition: 'Gastroenteritis', probability: 70, risk: 'Medium' },
          { condition: 'Food poisoning', probability: 50, risk: 'Low' },
          { condition: 'Appendicitis', probability: 10, risk: 'Low' }
        ]
      },
      23: {
        name: 'Vomiting',
        description: 'Forceful expulsion of stomach contents.',
        severity: 'medium',
        duration: 'Usually acute',
        warning: 'Persistent vomiting with dehydration requires medical care.',
        bodyParts: ['abdomen'],
        affectedParts: ['abdomen', 'chest'],
        outcomes: [
          { condition: 'Gastroenteritis', probability: 75, risk: 'Medium' },
          { condition: 'Food poisoning', probability: 60, risk: 'Medium' },
          { condition: 'Intestinal obstruction', probability: 10, risk: 'Low' }
        ]
      },
      24: {
        name: 'Diarrhea',
        description: 'Loose, watery stools occurring frequently.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe diarrhea with dehydration requires medical attention.',
        bodyParts: ['abdomen'],
        affectedParts: ['abdomen'],
        outcomes: [
          { condition: 'Gastroenteritis', probability: 80, risk: 'High' },
          { condition: 'Food poisoning', probability: 60, risk: 'Medium' },
          { condition: 'Inflammatory bowel disease', probability: 15, risk: 'Low' }
        ]
      },
      25: {
        name: 'Constipation',
        description: 'Difficulty passing stools or infrequent bowel movements.',
        severity: 'low',
        duration: 'Can be acute or chronic',
        warning: 'Severe constipation with abdominal pain requires evaluation.',
        bodyParts: ['abdomen'],
        affectedParts: ['abdomen'],
        outcomes: [
          { condition: 'Dietary factors', probability: 70, risk: 'Medium' },
          { condition: 'Irritable bowel syndrome', probability: 30, risk: 'Low' },
          { condition: 'Colon cancer', probability: 5, risk: 'Low' }
        ]
      },
      26: {
        name: 'Abdominal pain or cramps',
        description: 'Pain or discomfort in the stomach area.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe abdominal pain requires immediate medical attention.',
        bodyParts: ['abdomen'],
        affectedParts: ['abdomen'],
        outcomes: [
          { condition: 'Gastroenteritis', probability: 60, risk: 'Medium' },
          { condition: 'Appendicitis', probability: 20, risk: 'Low' },
          { condition: 'Gallbladder disease', probability: 15, risk: 'Low' }
        ]
      },
      27: {
        name: 'Bloating',
        description: 'Feeling of fullness or swelling in the abdomen.',
        severity: 'low',
        duration: 'Can be acute or chronic',
        warning: 'Persistent bloating with weight loss requires evaluation.',
        bodyParts: ['abdomen'],
        affectedParts: ['abdomen'],
        outcomes: [
          { condition: 'Dietary factors', probability: 70, risk: 'Medium' },
          { condition: 'Irritable bowel syndrome', probability: 40, risk: 'Low' },
          { condition: 'Ovarian cancer', probability: 5, risk: 'Low' }
        ]
      },
      28: {
        name: 'Heartburn',
        description: 'Burning sensation in the chest or throat.',
        severity: 'low',
        duration: 'Can be acute or chronic',
        warning: 'Severe heartburn with chest pain requires evaluation.',
        bodyParts: ['chest', 'abdomen'],
        affectedParts: ['chest', 'abdomen'],
        outcomes: [
          { condition: 'GERD', probability: 75, risk: 'Medium' },
          { condition: 'Hiatal hernia', probability: 30, risk: 'Low' },
          { condition: 'Esophageal cancer', probability: 5, risk: 'Low' }
        ]
      },
      29: {
        name: 'Blood in stool',
        description: 'Visible blood in bowel movements.',
        severity: 'high',
        duration: 'Requires immediate evaluation',
        warning: 'This symptom requires immediate medical attention.',
        bodyParts: ['abdomen'],
        affectedParts: ['abdomen'],
        outcomes: [
          { condition: 'Hemorrhoids', probability: 60, risk: 'Medium' },
          { condition: 'Colon cancer', probability: 20, risk: 'Low' },
          { condition: 'Inflammatory bowel disease', probability: 15, risk: 'Low' }
        ]
      },
      
      // Neurological Symptoms
      30: {
        name: 'Confusion or memory loss',
        description: 'Difficulty thinking clearly or remembering things.',
        severity: 'high',
        duration: 'Can be acute or chronic',
        warning: 'Sudden confusion requires immediate medical attention.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Dehydration', probability: 40, risk: 'Low' },
          { condition: 'Dementia', probability: 30, risk: 'Low' },
          { condition: 'Brain tumor', probability: 10, risk: 'Low' }
        ]
      },
      31: {
        name: 'Numbness or tingling',
        description: 'Loss of sensation or pins-and-needles feeling.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Sudden numbness on one side requires immediate attention.',
        bodyParts: ['arms', 'legs', 'head'],
        affectedParts: ['arms', 'hands', 'legs', 'feet', 'head'],
        outcomes: [
          { condition: 'Nerve compression', probability: 60, risk: 'Medium' },
          { condition: 'Diabetes', probability: 30, risk: 'Low' },
          { condition: 'Stroke', probability: 10, risk: 'Low' }
        ]
      },
      32: {
        name: 'Seizures',
        description: 'Sudden, uncontrolled electrical activity in the brain.',
        severity: 'high',
        duration: 'Usually brief episodes',
        warning: 'This is a medical emergency requiring immediate care.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Epilepsy', probability: 60, risk: 'Medium' },
          { condition: 'Brain injury', probability: 20, risk: 'Low' },
          { condition: 'Brain tumor', probability: 10, risk: 'Low' }
        ]
      },
      33: {
        name: 'Tremors',
        description: 'Involuntary shaking or trembling movements.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'New-onset tremors require medical evaluation.',
        bodyParts: ['arms', 'hands'],
        affectedParts: ['arms', 'hands', 'head'],
        outcomes: [
          { condition: 'Essential tremor', probability: 50, risk: 'Low' },
          { condition: 'Parkinson\'s disease', probability: 20, risk: 'Low' },
          { condition: 'Multiple sclerosis', probability: 10, risk: 'Low' }
        ]
      },
      34: {
        name: 'Balance problems',
        description: 'Difficulty maintaining balance or coordination.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Sudden balance problems require immediate evaluation.',
        bodyParts: ['head', 'legs'],
        affectedParts: ['head', 'legs', 'feet'],
        outcomes: [
          { condition: 'Inner ear disorder', probability: 50, risk: 'Low' },
          { condition: 'Neurological disorder', probability: 30, risk: 'Low' },
          { condition: 'Stroke', probability: 15, risk: 'Low' }
        ]
      },
      35: {
        name: 'Vision changes',
        description: 'Changes in eyesight or visual disturbances.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Sudden vision changes require immediate medical attention.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Refractive error', probability: 60, risk: 'Medium' },
          { condition: 'Cataracts', probability: 30, risk: 'Low' },
          { condition: 'Retinal detachment', probability: 10, risk: 'Low' }
        ]
      },
      36: {
        name: 'Speech difficulties',
        description: 'Problems with speaking or forming words.',
        severity: 'high',
        duration: 'Can be acute or chronic',
        warning: 'Sudden speech problems require immediate medical attention.',
        bodyParts: ['head'],
        affectedParts: ['head', 'neck'],
        outcomes: [
          { condition: 'Stroke', probability: 40, risk: 'Low' },
          { condition: 'Neurological disorder', probability: 30, risk: 'Low' },
          { condition: 'Brain tumor', probability: 10, risk: 'Low' }
        ]
      },
      
      // Muscle and Joint Symptoms
      37: {
        name: 'Muscle aches or pain',
        description: 'Pain or discomfort in muscles throughout the body.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe muscle pain with weakness requires evaluation.',
        bodyParts: ['arms', 'legs', 'torso'],
        affectedParts: ['arms', 'hands', 'legs', 'feet', 'torso'],
        outcomes: [
          { condition: 'Viral infection', probability: 70, risk: 'Medium' },
          { condition: 'Fibromyalgia', probability: 20, risk: 'Low' },
          { condition: 'Autoimmune disease', probability: 10, risk: 'Low' }
        ]
      },
      38: {
        name: 'Joint pain or stiffness',
        description: 'Pain, swelling, or stiffness in joints.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe joint pain with swelling requires evaluation.',
        bodyParts: ['arms', 'legs'],
        affectedParts: ['arms', 'hands', 'legs', 'feet'],
        outcomes: [
          { condition: 'Osteoarthritis', probability: 60, risk: 'Medium' },
          { condition: 'Rheumatoid arthritis', probability: 20, risk: 'Low' },
          { condition: 'Gout', probability: 15, risk: 'Low' }
        ]
      },
      39: {
        name: 'Swelling or redness in joints',
        description: 'Inflammation, swelling, or redness around joints.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe joint swelling requires medical evaluation.',
        bodyParts: ['arms', 'legs'],
        affectedParts: ['arms', 'hands', 'legs', 'feet'],
        outcomes: [
          { condition: 'Arthritis', probability: 70, risk: 'Medium' },
          { condition: 'Infection', probability: 20, risk: 'Low' },
          { condition: 'Autoimmune disease', probability: 10, risk: 'Low' }
        ]
      },
      
      // Skin and Hair Symptoms
      40: {
        name: 'Rashes',
        description: 'Red, irritated, or bumpy areas on the skin.',
        severity: 'low',
        duration: 'Can be acute or chronic',
        warning: 'Severe rashes with fever require medical attention.',
        bodyParts: ['arms', 'legs', 'torso'],
        affectedParts: ['arms', 'hands', 'legs', 'feet', 'torso'],
        outcomes: [
          { condition: 'Allergic reaction', probability: 70, risk: 'Medium' },
          { condition: 'Eczema', probability: 30, risk: 'Low' },
          { condition: 'Autoimmune disease', probability: 10, risk: 'Low' }
        ]
      },
      41: {
        name: 'Itching',
        description: 'Sensation that triggers the desire to scratch.',
        severity: 'low',
        duration: 'Can be acute or chronic',
        warning: 'Severe itching with rash requires evaluation.',
        bodyParts: ['arms', 'legs', 'torso'],
        affectedParts: ['arms', 'hands', 'legs', 'feet', 'torso'],
        outcomes: [
          { condition: 'Allergic reaction', probability: 60, risk: 'Medium' },
          { condition: 'Eczema', probability: 30, risk: 'Low' },
          { condition: 'Liver disease', probability: 10, risk: 'Low' }
        ]
      },
      42: {
        name: 'Hair loss',
        description: 'Excessive shedding or thinning of hair.',
        severity: 'low',
        duration: 'Can be gradual or sudden',
        warning: 'Sudden hair loss may indicate underlying conditions.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Androgenetic alopecia', probability: 70, risk: 'Medium' },
          { condition: 'Thyroid disorder', probability: 20, risk: 'Low' },
          { condition: 'Autoimmune disease', probability: 10, risk: 'Low' }
        ]
      },
      43: {
        name: 'Dry or flaky skin',
        description: 'Skin that lacks moisture or has scaling.',
        severity: 'low',
        duration: 'Can be acute or chronic',
        warning: 'Severe dry skin with cracking requires evaluation.',
        bodyParts: ['arms', 'legs', 'torso'],
        affectedParts: ['arms', 'hands', 'legs', 'feet', 'torso'],
        outcomes: [
          { condition: 'Eczema', probability: 60, risk: 'Medium' },
          { condition: 'Psoriasis', probability: 20, risk: 'Low' },
          { condition: 'Thyroid disorder', probability: 10, risk: 'Low' }
        ]
      },
      44: {
        name: 'Changes in skin color',
        description: 'Unusual changes in skin pigmentation.',
        severity: 'medium',
        duration: 'Can be gradual or sudden',
        warning: 'Sudden skin color changes require medical evaluation.',
        bodyParts: ['arms', 'legs', 'torso'],
        affectedParts: ['arms', 'hands', 'legs', 'feet', 'torso'],
        outcomes: [
          { condition: 'Sun damage', probability: 60, risk: 'Medium' },
          { condition: 'Vitiligo', probability: 20, risk: 'Low' },
          { condition: 'Liver disease', probability: 10, risk: 'Low' }
        ]
      },
      
      // Mental and Emotional Symptoms
      45: {
        name: 'Anxiety',
        description: 'Excessive worry, fear, or nervousness.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe anxiety with physical symptoms requires evaluation.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Generalized anxiety disorder', probability: 70, risk: 'Medium' },
          { condition: 'Panic disorder', probability: 20, risk: 'Low' },
          { condition: 'Depression', probability: 30, risk: 'Low' }
        ]
      },
      46: {
        name: 'Depression',
        description: 'Persistent feelings of sadness or hopelessness.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe depression with suicidal thoughts requires immediate help.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Major depressive disorder', probability: 60, risk: 'Medium' },
          { condition: 'Bipolar disorder', probability: 20, risk: 'Low' },
          { condition: 'Seasonal affective disorder', probability: 15, risk: 'Low' }
        ]
      },
      47: {
        name: 'Mood swings',
        description: 'Rapid changes in emotional state.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Severe mood swings may indicate underlying conditions.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Bipolar disorder', probability: 40, risk: 'Low' },
          { condition: 'Hormonal imbalance', probability: 30, risk: 'Low' },
          { condition: 'Premenstrual syndrome', probability: 25, risk: 'Low' }
        ]
      },
      48: {
        name: 'Insomnia or difficulty sleeping',
        description: 'Trouble falling asleep or staying asleep.',
        severity: 'medium',
        duration: 'Can be acute or chronic',
        warning: 'Chronic insomnia may indicate underlying conditions.',
        bodyParts: ['head'],
        affectedParts: ['head'],
        outcomes: [
          { condition: 'Insomnia disorder', probability: 60, risk: 'Medium' },
          { condition: 'Sleep apnea', probability: 20, risk: 'Low' },
          { condition: 'Depression', probability: 30, risk: 'Low' }
        ]
      }
    };
    
    return details[symptomId] || {
      name: 'Symptom',
      description: 'General symptom description',
      severity: 'medium',
      duration: 'Varies',
      warning: 'Consult a healthcare provider if symptoms persist.',
      bodyParts: ['torso'],
      affectedParts: ['torso'],
      outcomes: [
        { condition: 'General condition', probability: 50, risk: 'Medium' }
      ]
    };
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getAffectedBodyParts = () => {
    const affected = new Set();
    selectedSymptoms.forEach(symptomId => {
      const detail = getSymptomDetails(symptomId);
      detail.affectedParts.forEach(part => affected.add(part));
    });
    return Array.from(affected);
  };

  const affectedBodyParts = getAffectedBodyParts();

  const handlePartClick = (part) => {
    setSelectedBodyPart(part);
    console.log('Clicked body part:', part);
  };

  return (
    <div className="step-container">
      <div className="details-container">
        {/* Step header inside scrollable container */}
        <div className="step-header">
          <h2>Symptom Details</h2>
          <p>Detailed information about your selected symptoms and potential outcomes</p>
        </div>
        
        {/* Three-Part Layout */}
        <div className="details-layout">
          {/* Part 1: Left - Details Description */}
          <div className="details-left">
            <div className="details-list">
              {selectedSymptoms.map((symptomId) => {
                const detail = getSymptomDetails(symptomId);
                return (
                  <div key={symptomId} className="detail-card">
                    <div className="detail-header">
                      <h3>{detail.name}</h3>
                      <span 
                        className="severity-badge"
                        style={{ backgroundColor: getSeverityColor(detail.severity) }}
                      >
                        {detail.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="description">
                      <h4>Description</h4>
                      <p>{detail.description}</p>
                    </div>
                    
                    <div className="detail-info">
                      <div className="info-item">
                        <h4>Duration</h4>
                        <p>{detail.duration}</p>
                      </div>
                      
                      <div className="info-item">
                        <h4>Warning</h4>
                        <p className="warning-text">{detail.warning}</p>
                      </div>
                    </div>

                    <div className="affected-parts">
                      <h4>Affected Body Parts</h4>
                      <div className="parts-list">
                        {detail.affectedParts.map((part, index) => (
                          <button
                            key={index}
                            className="part-button"
                            onClick={() => handlePartClick(part)}
                          >
                            {part.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part 2: Right - 3D Model */}
          <div className="details-right">
            <HumanBody3D 
              affectedBodyParts={affectedBodyParts}
              onPartClick={handlePartClick}
              className="details-3d-model"
            />
          </div>
        </div>

        {/* Part 3: Bottom - Potential Outcomes */}
        <div className="outcomes-section">
          <h3>Potential Outcomes Analysis</h3>
          <div className="outcomes-grid">
            {selectedSymptoms.map((symptomId) => {
              const detail = getSymptomDetails(symptomId);
              return (
                <div key={symptomId} className="outcome-card">
                  <h4>{detail.name}</h4>
                  <div className="outcomes-list">
                    {detail.outcomes.map((outcome, index) => (
                      <div key={index} className="outcome-item">
                        <div className="outcome-header">
                          <span className="outcome-name">{outcome.condition}</span>
                          <span 
                            className="risk-badge"
                            style={{ backgroundColor: getRiskColor(outcome.risk) }}
                          >
                            {outcome.risk}
                          </span>
                        </div>
                        <div className="probability-bar">
                          <div 
                            className="probability-fill"
                            style={{ 
                              width: `${outcome.probability}%`,
                              backgroundColor: getRiskColor(outcome.risk)
                            }}
                          ></div>
                        </div>
                        <span className="probability-text">{outcome.probability}% probability</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="step-actions">
        <button className="back-btn" onClick={onBack}>Back</button>
        <button className="continue-btn" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
};

export default Details; 