const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { markAttend, getAttend } = require('../controllers/attendController');


const router = express.Router();

router.post('/marks', protect, markAttend);
router.get('/', protect, getAttend);

module.exports = router;
