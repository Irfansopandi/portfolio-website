const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateProfileImage, updateProfileCV } = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadImage, uploadCVFile } = require('../middleware/upload.middleware');

router.get('/', getProfile);
router.put('/', authenticate, updateProfile);
router.put('/image', authenticate, uploadImage('profiles').single('image'), updateProfileImage);
router.put('/cv', authenticate, uploadCVFile().single('cv'), updateProfileCV);

module.exports = router;
