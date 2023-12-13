const express = require("express");
const { verifyToken } = require("../middlewares/validateToken");
const { createChat, findUserChats, findChats } = require("../controllers/ChatController");

const router = express.Router();









router.post("/",  verifyToken, createChat)
router.get("/",  verifyToken, findUserChats)
router.get("/find/:chatId",  verifyToken, findChats)




module.exports = { router }