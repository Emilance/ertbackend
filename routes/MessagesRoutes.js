const express = require("express");
const { verifyToken } = require("../middlewares/validateToken");
const { createMessage, findChatMessages } = require("../controllers/MessageController");
const { findChats } = require("../controllers/ChatController");

const router = express.Router();









router.post("/",  verifyToken, createMessage)
router.get("/:chatId",  verifyToken, findChatMessages)




module.exports = { router }