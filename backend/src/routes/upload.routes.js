const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

// Generic upload endpoint
router.post('/', authenticate, uploadImage('general').single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  
  res.json({
    message: 'File uploaded successfully.',
    url: req.file.path,
    publicId: req.file.filename,
  });
});

module.exports = router;
