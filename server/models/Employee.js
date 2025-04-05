const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  department: { type: String },
  resume: { type: String },
  date_of_joining: { type: Date, default: Date.now },
  role: { type: String, default: 'Employee' },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
