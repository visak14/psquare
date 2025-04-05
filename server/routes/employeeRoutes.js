const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getEmployees, updateEmployee, deleteEmployee, assignRole } = require('../controllers/employeeController');

const router = express.Router();

router.get('/', protect, getEmployees);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);
router.put('/assign-role/:id', protect, assignRole);

module.exports = router;
