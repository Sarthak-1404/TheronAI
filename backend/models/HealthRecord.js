const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  recordType: {
    type: String,
    required: [true, 'Record type is required'],
    enum: [
      'Medical History',
      'Test Results',
      'Medication',
      'Appointment',
      'Vital Signs',
      'Immunization',
      'Surgery',
      'Allergy',
      'Chronic Condition',
      'Lab Report',
      'Imaging',
      'Prescription',
      'Progress Note',
      'Discharge Summary'
    ]
  },
  date: {
    type: Date,
    required: [true, 'Record date is required'],
    default: Date.now
  },
  title: {
    type: String,
    required: [true, 'Record title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  diagnosis: {
    primary: {
      type: String,
      maxlength: [200, 'Primary diagnosis cannot exceed 200 characters']
    },
    secondary: [{
      type: String,
      maxlength: [200, 'Secondary diagnosis cannot exceed 200 characters']
    }],
    icd10Code: {
      type: String,
      maxlength: [10, 'ICD-10 code cannot exceed 10 characters']
    }
  },
  symptoms: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Symptom name cannot exceed 100 characters']
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate'
    },
    duration: {
      type: String,
      maxlength: [50, 'Duration cannot exceed 50 characters']
    }
  }],
  vitalSigns: {
    bloodPressure: {
      systolic: {
        type: Number,
        min: [50, 'Systolic pressure too low'],
        max: [250, 'Systolic pressure too high']
      },
      diastolic: {
        type: Number,
        min: [30, 'Diastolic pressure too low'],
        max: [150, 'Diastolic pressure too high']
      }
    },
    heartRate: {
      type: Number,
      min: [30, 'Heart rate too low'],
      max: [200, 'Heart rate too high']
    },
    temperature: {
      type: Number,
      min: [90, 'Temperature too low'],
      max: [110, 'Temperature too high']
    },
    weight: {
      type: Number,
      min: [10, 'Weight too low'],
      max: [500, 'Weight too high']
    },
    height: {
      type: Number,
      min: [50, 'Height too low'],
      max: [250, 'Height too high']
    },
    oxygenSaturation: {
      type: Number,
      min: [70, 'Oxygen saturation too low'],
      max: [100, 'Oxygen saturation too high']
    }
  },
  testResults: {
    testType: {
      type: String,
      maxlength: [100, 'Test type cannot exceed 100 characters']
    },
    results: [{
      parameter: {
        type: String,
        required: true
      },
      value: {
        type: String,
        required: true
      },
      unit: {
        type: String,
        required: false
      },
      normalRange: {
        min: Number,
        max: Number
      },
      status: {
        type: String,
        enum: ['normal', 'high', 'low', 'critical'],
        default: 'normal'
      }
    }],
    labName: {
      type: String,
      maxlength: [100, 'Lab name cannot exceed 100 characters']
    },
    reportUrl: {
      type: String,
      required: false
    }
  },
  medications: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Medication name cannot exceed 100 characters']
    },
    dosage: {
      type: String,
      required: true,
      maxlength: [50, 'Dosage cannot exceed 50 characters']
    },
    frequency: {
      type: String,
      required: true,
      maxlength: [50, 'Frequency cannot exceed 50 characters']
    },
    duration: {
      type: String,
      maxlength: [50, 'Duration cannot exceed 50 characters']
    },
    instructions: {
      type: String,
      maxlength: [200, 'Instructions cannot exceed 200 characters']
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: false
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'discontinued'],
      default: 'active'
    },
    sideEffects: [{
      type: String,
      maxlength: [100, 'Side effect cannot exceed 100 characters']
    }]
  }],
  treatment: {
    procedures: [{
      name: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      description: {
        type: String,
        maxlength: [500, 'Procedure description cannot exceed 500 characters']
      },
      outcome: {
        type: String,
        maxlength: [200, 'Outcome cannot exceed 200 characters']
      }
    }],
    recommendations: [{
      type: String,
      maxlength: [200, 'Recommendation cannot exceed 200 characters']
    }],
    followUp: {
      required: {
        type: Boolean,
        default: false
      },
      date: Date,
      reason: {
        type: String,
        maxlength: [200, 'Follow-up reason cannot exceed 200 characters']
      }
    }
  },
  notes: {
    doctor: {
      type: String,
      maxlength: [1000, 'Doctor notes cannot exceed 1000 characters']
    },
    patient: {
      type: String,
      maxlength: [1000, 'Patient notes cannot exceed 1000 characters']
    },
    nurse: {
      type: String,
      maxlength: [1000, 'Nurse notes cannot exceed 1000 characters']
    }
  },
  attachments: [{
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'completed', 'reviewed', 'archived'],
    default: 'completed'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  isConfidential: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    },
    permission: {
      type: String,
      enum: ['read', 'write'],
      default: 'read'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for BMI calculation
healthRecordSchema.virtual('bmi').get(function() {
  if (!this.vitalSigns.weight || !this.vitalSigns.height) return null;
  const weightKg = this.vitalSigns.weight * 0.453592; // Convert lbs to kg
  const heightM = this.vitalSigns.height * 0.0254; // Convert inches to meters
  return (weightKg / (heightM * heightM)).toFixed(1);
});

// Virtual for age at record date
healthRecordSchema.virtual('ageAtRecord').get(function() {
  // This would need to be calculated based on patient's date of birth
  return null;
});

// Index for better query performance
healthRecordSchema.index({ patient: 1, date: -1 });
healthRecordSchema.index({ doctor: 1, date: -1 });
healthRecordSchema.index({ recordType: 1, date: -1 });
healthRecordSchema.index({ status: 1, priority: 1 });

// Method to add attachment
healthRecordSchema.methods.addAttachment = function(fileName, fileUrl, fileType, fileSize) {
  this.attachments.push({
    fileName,
    fileUrl,
    fileType,
    fileSize,
    uploadedAt: new Date()
  });
  return this.save();
};

// Method to share record with doctor
healthRecordSchema.methods.shareWithDoctor = function(doctorId, permission = 'read') {
  const existingShare = this.sharedWith.find(share => share.doctorId.toString() === doctorId.toString());
  
  if (existingShare) {
    existingShare.permission = permission;
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push({
      doctorId,
      sharedAt: new Date(),
      permission
    });
  }
  
  return this.save();
};

// Method to remove doctor access
healthRecordSchema.methods.removeDoctorAccess = function(doctorId) {
  this.sharedWith = this.sharedWith.filter(share => share.doctorId.toString() !== doctorId.toString());
  return this.save();
};

// Static method to find records by patient
healthRecordSchema.statics.findByPatient = function(patientId, options = {}) {
  const query = { patient: patientId };
  
  if (options.recordType) query.recordType = options.recordType;
  if (options.status) query.status = options.status;
  if (options.startDate) query.date = { $gte: options.startDate };
  if (options.endDate) query.date = { ...query.date, $lte: options.endDate };
  
  return this.find(query)
    .populate('doctor', 'firstName lastName specialization')
    .sort({ date: -1 })
    .limit(options.limit || 50);
};

// Static method to find records by doctor
healthRecordSchema.statics.findByDoctor = function(doctorId, options = {}) {
  const query = { doctor: doctorId };
  
  if (options.recordType) query.recordType = options.recordType;
  if (options.status) query.status = options.status;
  if (options.startDate) query.date = { $gte: options.startDate };
  if (options.endDate) query.date = { ...query.date, $lte: options.endDate };
  
  return this.find(query)
    .populate('patient', 'firstName lastName email')
    .sort({ date: -1 })
    .limit(options.limit || 50);
};

// Static method to get record statistics
healthRecordSchema.statics.getStats = async function(patientId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        patient: mongoose.Types.ObjectId(patientId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$recordType',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {};
  stats.forEach(stat => {
    result[stat._id] = stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('HealthRecord', healthRecordSchema); 