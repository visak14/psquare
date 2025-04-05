const mongoose = require('mongoose');


const LeaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },

  
  fullName: String,
  email: String,
  phoneNumber: String,
  position: String,
  department: String,
  experience: String,
  role: String,
  resume: String,
  date_of_joining: Date,


  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reason: { type: String },
  document: { type: String }
});

module.exports = mongoose.model('Leave', LeaveSchema);
