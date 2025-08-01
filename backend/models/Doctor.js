const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'Cardiologist',
      'Neurologist',
      'Dermatologist',
      'Orthopedic Surgeon',
      'Pediatrician',
      'Psychiatrist',
      'Oncologist',
      'Radiologist',
      'Anesthesiologist',
      'Emergency Medicine',
      'Family Medicine',
      'Internal Medicine',
      'Obstetrics and Gynecology',
      'Ophthalmologist',
      'Otolaryngologist',
      'Pathologist',
      'Pulmonologist',
      'Rheumatologist',
      'Urologist',
      'General Surgeon'
    ]
  },
  subSpecializations: [{
    type: String,
    trim: true
  }],
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true
  },
  experience: {
    years: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative']
    },
    description: {
      type: String,
      maxlength: [500, 'Experience description cannot exceed 500 characters']
    }
  },
  education: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  certifications: [{
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expiryDate: Date
  }],
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'USA'
    }
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: [500, 'Review comment cannot exceed 500 characters']
      },
      date: {
        type: Date,
        default: Date.now
      }
    }]
  },
  availability: {
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    workingHours: {
      start: {
        type: String,
        required: true,
        default: '09:00'
      },
      end: {
        type: String,
        required: true,
        default: '17:00'
      }
    },
    appointmentDuration: {
      type: Number,
      default: 30, // minutes
      min: 15,
      max: 120
    },
    breakTime: {
      type: Number,
      default: 15, // minutes
      min: 0,
      max: 60
    }
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  languages: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    maxPatientsPerDay: {
      type: Number,
      default: 20,
      min: 1,
      max: 50
    },
    allowOnlineConsultation: {
      type: Boolean,
      default: true
    },
    allowEmergencyCalls: {
      type: Boolean,
      default: true
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
doctorSchema.virtual('fullName').get(function() {
  return `Dr. ${this.firstName} ${this.lastName}`;
});

// Virtual for experience text
doctorSchema.virtual('experienceText').get(function() {
  return `${this.experience.years}+ years`;
});

// Virtual for average rating
doctorSchema.virtual('averageRating').get(function() {
  if (this.rating.count === 0) return 0;
  return (this.rating.reviews.reduce((sum, review) => sum + review.rating, 0) / this.rating.count).toFixed(1);
});

// Index for better query performance
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'address.city': 1, 'address.state': 1 });
doctorSchema.index({ isActive: 1, isVerified: 1 });
doctorSchema.index({ rating: -1 });

// Method to get public profile
doctorSchema.methods.getPublicProfile = function() {
  const doctorObject = this.toObject();
  delete doctorObject.__v;
  return doctorObject;
};

// Method to update rating
doctorSchema.methods.updateRating = function() {
  if (this.rating.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const totalRating = this.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.rating.reviews.length;
    this.rating.count = this.rating.reviews.length;
  }
  return this.save();
};

// Method to add review
doctorSchema.methods.addReview = function(patientId, rating, comment) {
  this.rating.reviews.push({
    patientId,
    rating,
    comment,
    date: new Date()
  });
  return this.updateRating();
};

// Static method to find by specialization
doctorSchema.statics.findBySpecialization = function(specialization) {
  return this.find({ 
    specialization, 
    isActive: true, 
    isVerified: true 
  }).sort({ 'rating.average': -1 });
};

// Static method to find available doctors
doctorSchema.statics.findAvailable = function() {
  return this.find({ 
    isActive: true, 
    isVerified: true 
  }).sort({ 'rating.average': -1 });
};

module.exports = mongoose.model('Doctor', doctorSchema); 