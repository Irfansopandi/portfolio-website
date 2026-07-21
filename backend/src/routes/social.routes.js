const express = require('express');
const router = express.Router();
const { getAllSocial, upsertSocial, deleteSocial } = require('../controllers/social.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', getAllSocial);
router.post('/', authenticate, upsertSocial);
router.delete('/:id', authenticate, deleteSocial);

module.exports = router;
