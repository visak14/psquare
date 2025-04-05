const mongoose = require('mongoose');

const AttendSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  task: { type: String,  },
  department: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent' , 'Medical Leave' , 'Work from home'], default: 'Absent' }
});

module.exports = mongoose.model('Attend', AttendSchema);
