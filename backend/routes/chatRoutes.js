const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/chats', authenticateToken, chatController.createOrFindChat);
router.get('/chats', authenticateToken, chatController.getUserChats);

module.exports = router;
