const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/messages', authenticateToken, messageController.sendMessage);
router.get('/messages/:chatId', authenticateToken, messageController.getChatMessages);

module.exports = router;
