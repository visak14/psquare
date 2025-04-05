const Candidate = require('../models/Candidate');
const Employee = require("../models/Employee");
const path = require('path');
const fs = require('fs');

exports.createCandidate = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, position, experience } = req.body;
    const resumePath = req.file ? `uploads/resumes/${req.file.filename}` : null;

    const newCandidate = await Candidate.create({
      fullName,
      email,
      phoneNumber,
      position,
      experience,
      resume: resumePath,
    });

    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getCandidates = async (req, res) => {
  try {
    const { status, position, search } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (position) filter.position = position;
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const candidates = await Candidate.find(filter);
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCandidate = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, position, experience, status } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    candidate.fullName = fullName || candidate.fullName;
    candidate.email = email || candidate.email;
    candidate.phoneNumber = phoneNumber || candidate.phoneNumber;
    candidate.position = position || candidate.position;
    candidate.experience = experience || candidate.experience;
    candidate.status = status || candidate.status;

    const updatedCandidate = await candidate.save();
    res.json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

   
    if (candidate.resume) {
      const filePath = path.resolve(candidate.resume);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await candidate.deleteOne();
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resume) return res.status(404).json({ message: 'Resume not found' });

    const filePath = path.resolve(candidate.resume);
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const Attend = require('../models/Attend'); 

exports.moveToEmployee = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    
    if (candidate.status.toLowerCase() !== "selected") {
      return res.status(400).json({ message: "Candidate must be selected to be moved" });
    }

    const existingEmployee = await Employee.findOne({ email: candidate.email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Candidate already exists as an employee" });
    }

    
    const newEmployee = await Employee.create({
      fullName: candidate.fullName,
      email: candidate.email,
      phoneNumber: candidate.phoneNumber,
      position: candidate.position,
      experience: candidate.experience,
      resume: candidate.resume,
      role: "Employee",
      date_of_joining: new Date(),
    });

    
    const attendance = await Attend.create({
      employee: newEmployee._id,
      fullName: newEmployee.fullName,
      position: newEmployee.position,
      department: newEmployee.department || "Not Assigned",
      task: "", 
      date: new Date(),
      status: "Absent", 
    });
    

   

  

    res.json({ message: "Candidate moved to employees and attendance marked", employee: newEmployee });
  } catch (error) {
    console.error("Error Moving Candidate:", error);
    res.status(500).json({ message: error.message });
  }
};

