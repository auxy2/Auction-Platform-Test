// server/routes/chatRoutes.js
const express = require('express');
const chatController = require('../controllers/chat');
const authMiddleware = require('../middleware/auth');


const router = express.Router();

// Example endpoint to send a message
router.post('/:userId/send-message', chatController.sendMessage);

// Example endpoint to get chat history
router.get('/:userId/chat-history', chatController.getChatHistory);

module.exports = router;
