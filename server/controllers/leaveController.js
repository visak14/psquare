const Leave = require('../models/Leave');


exports.applyLeave = async (req, res) => {
  try {
    const {
      employee,
      fullName,
      email,
      phoneNumber,
      position,
      department,
      experience,
      role,
      resume,
      date_of_joining,
      startDate,
      endDate,
      reason,
    } = req.body;

    const document = req.file ? req.file.path : null;

    const leave = await Leave.create({
      employee,
      fullName,
      email,
      phoneNumber,
      position,
      department,
      experience,
      role,
      resume,
      date_of_joining,
      startDate,
      endDate,
      reason,
      document,
      status: "Pending",
    });

    res.status(201).json(leave); 
  } catch (error) {
    console.error("Error applying leave:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getLeaves = async (req, res) => {
  const leaves = await Leave.find({ status: 'Approved' });
  res.json(leaves);
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find(); 
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave not found' });

  leave.status = status;
  await leave.save();
  res.json({ message: 'Leave status updated' });
};
