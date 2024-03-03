const express = require("express");
const { verifyToken } = require("../middlewares/validateToken");
const { createChat, findUserChats, findChats, destroyChat, updateUnreadMessageCount, closeChat, regenerateChat } = require("../controllers/ChatController");

const router = express.Router();









router.post("/",  verifyToken, createChat)

router.get("/",  verifyToken, findUserChats)
router.get("/find/:chatId",  verifyToken, findChats)
router.put("/regenerate/:chatId",  verifyToken, regenerateChat)
router.put("/updateUnreadMessage/:chatId", verifyToken, updateUnreadMessageCount )
router.put("/close/:chatId",verifyToken, closeChat)

router.delete("/:chatId",verifyToken, destroyChat )



module.exports = { router }