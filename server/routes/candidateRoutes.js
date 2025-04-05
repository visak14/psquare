const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const upload = require('../middleware/multerConfig'); // Import Multer for resume upload

router.post('/create', upload.single('resume'), candidateController.createCandidate);

router.get('/', candidateController.getCandidates);

router.put('/:id', candidateController.updateCandidate);
router.delete('/:id', candidateController.deleteCandidate);
router.get('/:id/resume', candidateController.downloadResume);

router.post('/:id/move-to-employee', candidateController.moveToEmployee);

module.exports = router;
