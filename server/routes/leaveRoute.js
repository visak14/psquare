const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { applyLeave, getLeaves, getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');

const router = express.Router();

router.post('/', protect, upload.single('document'), applyLeave);
router.get('/', protect, getLeaves);
router.get('/all', protect, getAllLeaves); 
router.put('/:id', protect, updateLeaveStatus);

module.exports = router;
