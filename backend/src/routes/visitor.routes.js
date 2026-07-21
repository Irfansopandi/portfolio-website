const express = require('express');
const router = express.Router();
const { trackVisitor, getStats } = require('../controllers/visitor.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/track', trackVisitor);
router.get('/stats', authenticate, getStats);

module.exports = router;
