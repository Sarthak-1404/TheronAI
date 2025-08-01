const express = require('express');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const HealthRecord = require('../models/HealthRecord');
const Appointment = require('../models/Appointment');
const { authenticateToken, authorizeResource } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/export/health-records/:userId
// @desc    Export health records as PDF
// @access  Private
router.get('/health-records/:userId', authenticateToken, authorizeResource, async (req, res) => {
  try {
    const { userId } = req.params;
    const { format = 'pdf' } = req.query;

    // Get user and their health records
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const healthRecords = await HealthRecord.find({ patientId: userId })
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ createdAt: -1 });

    if (format === 'pdf') {
      return await exportHealthRecordsPDF(res, user, healthRecords);
    } else if (format === 'excel') {
      return await exportHealthRecordsExcel(res, user, healthRecords);
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Unsupported format. Use "pdf" or "excel"'
      });
    }
  } catch (error) {
    console.error('Export health records error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export health records'
    });
  }
});

// @route   GET /api/export/appointments/:userId
// @desc    Export appointments as PDF or Excel
// @access  Private
router.get('/appointments/:userId', authenticateToken, authorizeResource, async (req, res) => {
  try {
    const { userId } = req.params;
    const { format = 'pdf', startDate, endDate } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Build query
    const query = { patientId: userId };
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ appointmentDate: -1 });

    if (format === 'pdf') {
      return await exportAppointmentsPDF(res, user, appointments);
    } else if (format === 'excel') {
      return await exportAppointmentsExcel(res, user, appointments);
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Unsupported format. Use "pdf" or "excel"'
      });
    }
  } catch (error) {
    console.error('Export appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export appointments'
    });
  }
});

// @route   GET /api/export/medical-summary/:userId
// @desc    Export comprehensive medical summary
// @access  Private
router.get('/medical-summary/:userId', authenticateToken, authorizeResource, async (req, res) => {
  try {
    const { userId } = req.params;
    const { format = 'pdf' } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get all medical data
    const healthRecords = await HealthRecord.find({ patientId: userId })
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ createdAt: -1 });

    const appointments = await Appointment.find({ patientId: userId })
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ appointmentDate: -1 });

    if (format === 'pdf') {
      return await exportMedicalSummaryPDF(res, user, healthRecords, appointments);
    } else if (format === 'excel') {
      return await exportMedicalSummaryExcel(res, user, healthRecords, appointments);
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Unsupported format. Use "pdf" or "excel"'
      });
    }
  } catch (error) {
    console.error('Export medical summary error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to export medical summary'
    });
  }
});

// Helper function to export health records as PDF
async function exportHealthRecordsPDF(res, user, healthRecords) {
  const doc = new PDFDocument();
  const filename = `health_records_${user._id}_${Date.now()}.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  doc.pipe(res);

  // Add title
  doc.fontSize(20).text('Health Records Report', { align: 'center' });
  doc.moveDown();
  
  // Patient information
  doc.fontSize(14).text('Patient Information');
  doc.fontSize(12).text(`Name: ${user.firstName} ${user.lastName}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Phone: ${user.phoneNumber}`);
  doc.text(`Date of Birth: ${user.dateOfBirth.toDateString()}`);
  doc.text(`Blood Type: ${user.bloodType || 'Not specified'}`);
  doc.moveDown();

  // Health records
  doc.fontSize(14).text('Health Records');
  doc.moveDown();

  if (healthRecords.length === 0) {
    doc.text('No health records found.');
  } else {
    healthRecords.forEach((record, index) => {
      doc.fontSize(12).text(`Record ${index + 1} - ${record.createdAt.toDateString()}`);
      doc.fontSize(10).text(`Doctor: ${record.doctorId ? `${record.doctorId.firstName} ${record.doctorId.lastName}` : 'Not specified'}`);
      doc.text(`Diagnosis: ${record.diagnosis || 'Not specified'}`);
      doc.text(`Treatment: ${record.treatment || 'Not specified'}`);
      doc.text(`Notes: ${record.notes || 'No notes'}`);
      doc.moveDown();
    });
  }

  doc.end();
}

// Helper function to export health records as Excel
async function exportHealthRecordsExcel(res, user, healthRecords) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Health Records');

  // Add headers
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Doctor', key: 'doctor', width: 25 },
    { header: 'Diagnosis', key: 'diagnosis', width: 30 },
    { header: 'Treatment', key: 'treatment', width: 30 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  // Add patient info
  worksheet.addRow([]);
  worksheet.addRow(['Patient Information']);
  worksheet.addRow(['Name', `${user.firstName} ${user.lastName}`]);
  worksheet.addRow(['Email', user.email]);
  worksheet.addRow(['Phone', user.phoneNumber]);
  worksheet.addRow(['Date of Birth', user.dateOfBirth.toDateString()]);
  worksheet.addRow(['Blood Type', user.bloodType || 'Not specified']);
  worksheet.addRow([]);

  // Add health records
  worksheet.addRow(['Health Records']);
  worksheet.addRow(['Date', 'Doctor', 'Diagnosis', 'Treatment', 'Notes']);

  healthRecords.forEach(record => {
    worksheet.addRow([
      record.createdAt.toDateString(),
      record.doctorId ? `${record.doctorId.firstName} ${record.doctorId.lastName}` : 'Not specified',
      record.diagnosis || 'Not specified',
      record.treatment || 'Not specified',
      record.notes || 'No notes'
    ]);
  });

  const filename = `health_records_${user._id}_${Date.now()}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
}

// Helper function to export appointments as PDF
async function exportAppointmentsPDF(res, user, appointments) {
  const doc = new PDFDocument();
  const filename = `appointments_${user._id}_${Date.now()}.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  doc.pipe(res);

  // Add title
  doc.fontSize(20).text('Appointments Report', { align: 'center' });
  doc.moveDown();
  
  // Patient information
  doc.fontSize(14).text('Patient Information');
  doc.fontSize(12).text(`Name: ${user.firstName} ${user.lastName}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Phone: ${user.phoneNumber}`);
  doc.moveDown();

  // Appointments
  doc.fontSize(14).text('Appointments');
  doc.moveDown();

  if (appointments.length === 0) {
    doc.text('No appointments found.');
  } else {
    appointments.forEach((appointment, index) => {
      doc.fontSize(12).text(`Appointment ${index + 1} - ${appointment.appointmentDate.toDateString()}`);
      doc.fontSize(10).text(`Time: ${appointment.appointmentDate.toTimeString()}`);
      doc.text(`Doctor: ${appointment.doctorId ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : 'Not specified'}`);
      doc.text(`Type: ${appointment.appointmentType}`);
      doc.text(`Status: ${appointment.status}`);
      doc.text(`Reason: ${appointment.reason || 'Not specified'}`);
      doc.moveDown();
    });
  }

  doc.end();
}

// Helper function to export appointments as Excel
async function exportAppointmentsExcel(res, user, appointments) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Appointments');

  // Add headers
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Time', key: 'time', width: 15 },
    { header: 'Doctor', key: 'doctor', width: 25 },
    { header: 'Type', key: 'type', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Reason', key: 'reason', width: 40 }
  ];

  // Add patient info
  worksheet.addRow([]);
  worksheet.addRow(['Patient Information']);
  worksheet.addRow(['Name', `${user.firstName} ${user.lastName}`]);
  worksheet.addRow(['Email', user.email]);
  worksheet.addRow(['Phone', user.phoneNumber]);
  worksheet.addRow([]);

  // Add appointments
  worksheet.addRow(['Appointments']);
  worksheet.addRow(['Date', 'Time', 'Doctor', 'Type', 'Status', 'Reason']);

  appointments.forEach(appointment => {
    worksheet.addRow([
      appointment.appointmentDate.toDateString(),
      appointment.appointmentDate.toTimeString(),
      appointment.doctorId ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : 'Not specified',
      appointment.appointmentType,
      appointment.status,
      appointment.reason || 'Not specified'
    ]);
  });

  const filename = `appointments_${user._id}_${Date.now()}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
}

// Helper function to export medical summary as PDF
async function exportMedicalSummaryPDF(res, user, healthRecords, appointments) {
  const doc = new PDFDocument();
  const filename = `medical_summary_${user._id}_${Date.now()}.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  doc.pipe(res);

  // Add title
  doc.fontSize(20).text('Medical Summary Report', { align: 'center' });
  doc.moveDown();
  
  // Patient information
  doc.fontSize(14).text('Patient Information');
  doc.fontSize(12).text(`Name: ${user.firstName} ${user.lastName}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Phone: ${user.phoneNumber}`);
  doc.text(`Date of Birth: ${user.dateOfBirth.toDateString()}`);
  doc.text(`Blood Type: ${user.bloodType || 'Not specified'}`);
  doc.moveDown();

  // Medical history
  if (user.medicalHistory) {
    doc.fontSize(14).text('Medical History');
    doc.fontSize(12);
    
    if (user.medicalHistory.allergies && user.medicalHistory.allergies.length > 0) {
      doc.text(`Allergies: ${user.medicalHistory.allergies.join(', ')}`);
    }
    
    if (user.medicalHistory.chronicConditions && user.medicalHistory.chronicConditions.length > 0) {
      doc.text(`Chronic Conditions: ${user.medicalHistory.chronicConditions.join(', ')}`);
    }
    
    if (user.medicalHistory.currentMedications && user.medicalHistory.currentMedications.length > 0) {
      doc.text('Current Medications:');
      user.medicalHistory.currentMedications.forEach(med => {
        doc.text(`  - ${med.name} (${med.dosage}) - ${med.frequency}`);
      });
    }
    doc.moveDown();
  }

  // Recent health records
  doc.fontSize(14).text('Recent Health Records');
  doc.moveDown();

  if (healthRecords.length === 0) {
    doc.text('No health records found.');
  } else {
    healthRecords.slice(0, 10).forEach((record, index) => {
      doc.fontSize(12).text(`Record ${index + 1} - ${record.createdAt.toDateString()}`);
      doc.fontSize(10).text(`Doctor: ${record.doctorId ? `${record.doctorId.firstName} ${record.doctorId.lastName}` : 'Not specified'}`);
      doc.text(`Diagnosis: ${record.diagnosis || 'Not specified'}`);
      doc.text(`Treatment: ${record.treatment || 'Not specified'}`);
      doc.moveDown();
    });
  }

  // Recent appointments
  doc.fontSize(14).text('Recent Appointments');
  doc.moveDown();

  if (appointments.length === 0) {
    doc.text('No appointments found.');
  } else {
    appointments.slice(0, 10).forEach((appointment, index) => {
      doc.fontSize(12).text(`Appointment ${index + 1} - ${appointment.appointmentDate.toDateString()}`);
      doc.fontSize(10).text(`Doctor: ${appointment.doctorId ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : 'Not specified'}`);
      doc.text(`Type: ${appointment.appointmentType}`);
      doc.text(`Status: ${appointment.status}`);
      doc.moveDown();
    });
  }

  doc.end();
}

// Helper function to export medical summary as Excel
async function exportMedicalSummaryExcel(res, user, healthRecords, appointments) {
  const workbook = new ExcelJS.Workbook();
  
  // Patient Info Sheet
  const patientSheet = workbook.addWorksheet('Patient Information');
  patientSheet.columns = [
    { header: 'Field', key: 'field', width: 20 },
    { header: 'Value', key: 'value', width: 40 }
  ];

  patientSheet.addRow(['Name', `${user.firstName} ${user.lastName}`]);
  patientSheet.addRow(['Email', user.email]);
  patientSheet.addRow(['Phone', user.phoneNumber]);
  patientSheet.addRow(['Date of Birth', user.dateOfBirth.toDateString()]);
  patientSheet.addRow(['Blood Type', user.bloodType || 'Not specified']);

  if (user.medicalHistory) {
    patientSheet.addRow([]);
    patientSheet.addRow(['Medical History']);
    if (user.medicalHistory.allergies && user.medicalHistory.allergies.length > 0) {
      patientSheet.addRow(['Allergies', user.medicalHistory.allergies.join(', ')]);
    }
    if (user.medicalHistory.chronicConditions && user.medicalHistory.chronicConditions.length > 0) {
      patientSheet.addRow(['Chronic Conditions', user.medicalHistory.chronicConditions.join(', ')]);
    }
  }

  // Health Records Sheet
  const recordsSheet = workbook.addWorksheet('Health Records');
  recordsSheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Doctor', key: 'doctor', width: 25 },
    { header: 'Diagnosis', key: 'diagnosis', width: 30 },
    { header: 'Treatment', key: 'treatment', width: 30 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  healthRecords.forEach(record => {
    recordsSheet.addRow([
      record.createdAt.toDateString(),
      record.doctorId ? `${record.doctorId.firstName} ${record.doctorId.lastName}` : 'Not specified',
      record.diagnosis || 'Not specified',
      record.treatment || 'Not specified',
      record.notes || 'No notes'
    ]);
  });

  // Appointments Sheet
  const appointmentsSheet = workbook.addWorksheet('Appointments');
  appointmentsSheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Time', key: 'time', width: 15 },
    { header: 'Doctor', key: 'doctor', width: 25 },
    { header: 'Type', key: 'type', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Reason', key: 'reason', width: 40 }
  ];

  appointments.forEach(appointment => {
    appointmentsSheet.addRow([
      appointment.appointmentDate.toDateString(),
      appointment.appointmentDate.toTimeString(),
      appointment.doctorId ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : 'Not specified',
      appointment.appointmentType,
      appointment.status,
      appointment.reason || 'Not specified'
    ]);
  });

  const filename = `medical_summary_${user._id}_${Date.now()}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
}

module.exports = router; 