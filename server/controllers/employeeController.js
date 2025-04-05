const Employee = require('../models/Employee');


exports.getEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};


exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    
    Object.keys(req.body).forEach((key) => {
      employee[key] = req.body[key];
    });

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: 'Failed to update employee' });
  }
};


exports.deleteEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  await employee.deleteOne();
  res.json({ message: 'Employee deleted' });
};


exports.assignRole = async (req, res) => {
  const { role } = req.body;
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Employee not found' });

  employee.role = role;
  await employee.save();
  res.json({ message: 'Role updated' });
};
