const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/, 'Please enter a valid time format (HH:MM AM/PM)']
  },
  duration: {
    type: Number,
    default: 30, // minutes
    min: [15, 'Appointment duration must be at least 15 minutes'],
    max: [120, 'Appointment duration cannot exceed 120 minutes']
  },
  type: {
    type: String,
    required: [true, 'Appointment type is required'],
    enum: [
      'Checkup',
      'Consultation',
      'Follow-up',
      'Emergency',
      'Surgery',
      'Test',
      'Vaccination',
      'Physical Therapy',
      'Mental Health',
      'Dental',
      'Eye Exam',
      'Laboratory',
      'Imaging',
      'Specialist Consultation'
    ]
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  reason: {
    type: String,
    required: [true, 'Appointment reason is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  notes: {
    patient: {
      type: String,
      maxlength: [1000, 'Patient notes cannot exceed 1000 characters']
    },
    doctor: {
      type: String,
      maxlength: [1000, 'Doctor notes cannot exceed 1000 characters']
    }
  },
  diagnosis: {
    type: String,
    maxlength: [500, 'Diagnosis cannot exceed 500 characters']
  },
  prescription: {
    medications: [{
      name: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      frequency: {
        type: String,
        required: true
      },
      duration: {
        type: String,
        required: true
      },
      instructions: {
        type: String,
        maxlength: [200, 'Instructions cannot exceed 200 characters']
      }
    }],
    tests: [{
      name: String,
      description: String,
      urgency: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine'
      }
    }],
    followUp: {
      required: {
        type: Boolean,
        default: false
      },
      date: Date,
      reason: String
    }
  },
  payment: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Payment amount cannot be negative']
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'waived'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'online'],
      required: false
    },
    transactionId: {
      type: String,
      required: false
    }
  },
  location: {
    type: {
      type: String,
      enum: ['in-person', 'virtual', 'home-visit'],
      default: 'in-person'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'USA'
      }
    },
    virtualMeetingLink: {
      type: String,
      required: false
    }
  },
  reminders: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      required: false
    },
    cancelledAt: {
      type: Date,
      required: false
    },
    reason: {
      type: String,
      maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
    }
  },
  rating: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: false
    },
    comment: {
      type: String,
      maxlength: [500, 'Rating comment cannot exceed 500 characters']
    },
    submittedAt: {
      type: Date,
      required: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for appointment date and time
appointmentSchema.virtual('appointmentDateTime').get(function() {
  const date = new Date(this.appointmentDate);
  const [time, period] = this.appointmentTime.split(' ');
  const [hours, minutes] = time.split(':');
  
  let hour = parseInt(hours);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  
  date.setHours(hour, parseInt(minutes), 0, 0);
  return date;
});

// Virtual for end time
appointmentSchema.virtual('endTime').get(function() {
  const startTime = new Date(this.appointmentDateTime);
  const endTime = new Date(startTime.getTime() + this.duration * 60000);
  return endTime;
});

// Virtual for is overdue
appointmentSchema.virtual('isOverdue').get(function() {
  if (this.status !== 'scheduled' && this.status !== 'confirmed') return false;
  return new Date() > this.appointmentDateTime;
});

// Virtual for is today
appointmentSchema.virtual('isToday').get(function() {
  const today = new Date();
  const appointmentDate = new Date(this.appointmentDate);
  return today.toDateString() === appointmentDate.toDateString();
});

// Index for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

// Pre-save middleware to validate appointment time
appointmentSchema.pre('save', function(next) {
  // Check if appointment is in the past
  if (this.appointmentDateTime < new Date() && this.status === 'scheduled') {
    this.status = 'cancelled';
    this.cancellation = {
      cancelledBy: 'system',
      cancelledAt: new Date(),
      reason: 'Appointment time has passed'
    };
  }
  next();
});

// Method to check if appointment conflicts with existing appointments
appointmentSchema.methods.hasConflict = async function() {
  const Appointment = this.constructor;
  const startTime = this.appointmentDateTime;
  const endTime = this.endTime;
  
  const conflictingAppointment = await Appointment.findOne({
    doctor: this.doctor,
    _id: { $ne: this._id },
    status: { $in: ['scheduled', 'confirmed'] },
    $or: [
      {
        appointmentDateTime: { $lt: endTime },
        $expr: {
          $gte: {
            $add: ['$appointmentDateTime', { $multiply: ['$duration', 60000] }]
          },
          startTime
        }
      }
    ]
  });
  
  return conflictingAppointment !== null;
};

// Method to cancel appointment
appointmentSchema.methods.cancelAppointment = function(cancelledBy, reason) {
  this.status = 'cancelled';
  this.cancellation = {
    cancelledBy,
    cancelledAt: new Date(),
    reason
  };
  return this.save();
};

// Method to complete appointment
appointmentSchema.methods.completeAppointment = function(diagnosis, prescription) {
  this.status = 'completed';
  if (diagnosis) this.diagnosis = diagnosis;
  if (prescription) this.prescription = prescription;
  return this.save();
};

// Static method to find upcoming appointments
appointmentSchema.statics.findUpcoming = function(userId, limit = 10) {
  return this.find({
    patient: userId,
    status: { $in: ['scheduled', 'confirmed'] },
    appointmentDateTime: { $gte: new Date() }
  })
  .populate('doctor', 'firstName lastName specialization profileImage')
  .sort({ appointmentDateTime: 1 })
  .limit(limit);
};

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(doctorId, startDate, endDate) {
  return this.find({
    doctor: doctorId,
    appointmentDate: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .populate('patient', 'firstName lastName email phoneNumber')
  .sort({ appointmentDateTime: 1 });
};

// Static method to get appointment statistics
appointmentSchema.statics.getStats = async function(doctorId, startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        doctor: mongoose.Types.ObjectId(doctorId),
        appointmentDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    scheduled: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('Appointment', appointmentSchema); 