const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router
  .route('/')
  .post(chatController.chatWithAI);

module.exports = router;
