const Employee = require('../models/Employee');
const Attend = require('../models/Attend');
const Leave = require('../models/Leave');

exports.markAttend = async (req, res) => {
  const { employeeId, status } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttend = await Attend.findOne({
      employee: employee._id,
      date: { $gte: today },
    });

    if (existingAttend) {
      existingAttend.status = status;
      await existingAttend.save();
    }

    
    let leaveEntry = null;
    if (status === 'Present') {
      leaveEntry = await Leave.create({
        employee: employee._id,
    
        
        fullName: employee.fullName,
        email: employee.email,
        phoneNumber: employee.phoneNumber,
        position: employee.position,
        department: employee.department || 'Not Assigned',
        experience: employee.experience,
        role: employee.role,
        resume: employee.resume,
        date_of_joining: employee.date_of_joining,
    
        
        startDate: new Date(),
        endDate: new Date(),
        status: 'Approved',
        document: null,
      });
    }
    

    res.json({
      message: 'Status updated successfully',
      leave: leaveEntry || null,
    });

  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: error.message });
  }
};




exports.getAttend= async (req, res) => {
  const attend = await Attend.find().populate('employee'); 

  res.json(attend);
};
