const express = require('express');
const router = express.Router();
const { getAllCertificates, createCertificate, updateCertificate, deleteCertificate } = require('../controllers/certificate.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

router.get('/', getAllCertificates);
router.post('/', authenticate, uploadImage('certificates').single('image'), createCertificate);
router.put('/:id', authenticate, uploadImage('certificates').single('image'), updateCertificate);
router.delete('/:id', authenticate, deleteCertificate);

module.exports = router;
