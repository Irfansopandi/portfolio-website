const express = require('express');
const router = express.Router();
const { getAllEducation, createEducation, updateEducation, deleteEducation } = require('../controllers/education.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

router.get('/', getAllEducation);
router.post('/', authenticate, uploadImage('education').single('logo'), createEducation);
router.put('/:id', authenticate, uploadImage('education').single('logo'), updateEducation);
router.delete('/:id', authenticate, deleteEducation);

module.exports = router;
