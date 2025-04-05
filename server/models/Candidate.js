const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  resume: { type: String }, 
  status: { type: String, enum: ['New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'], default: 'New' }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
