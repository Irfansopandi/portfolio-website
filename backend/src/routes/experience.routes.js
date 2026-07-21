const express = require('express');
const router = express.Router();
const {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experience.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

const handleExperienceUpload = (req, res, next) => {
  uploadImage('experiences').array('photos', 10)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Ukuran file foto maksimal 10MB per foto.' });
      }
      return res.status(400).json({ error: err.message || 'Gagal mengunggah foto.' });
    }
    next();
  });
};

router.get('/', getAllExperiences);
router.post('/', authenticate, handleExperienceUpload, createExperience);
router.put('/:id', authenticate, handleExperienceUpload, updateExperience);
router.delete('/:id', authenticate, deleteExperience);


module.exports = router;
