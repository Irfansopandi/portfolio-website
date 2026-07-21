const express = require('express');
const router = express.Router();
const { getAllMessages, getUnreadCount, createMessage, updateMessageStatus, deleteMessage } = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, getAllMessages);
router.get('/unread-count', authenticate, getUnreadCount);
router.post('/', createMessage); // Public - contact form
router.put('/:id/status', authenticate, updateMessageStatus);
router.delete('/:id', authenticate, deleteMessage);

module.exports = router;
