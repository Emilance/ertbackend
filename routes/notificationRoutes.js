const express =require("express");

const { verifyToken } = require("../middlewares/validateToken");
const { getMyNotification, deleteNotification, getNotification } = require("../controllers/NotificationController");


const router = express.Router();


router.get("/me", verifyToken, getMyNotification )

router.get("/:id", verifyToken, getNotification )

router.delete("/:id", verifyToken, deleteNotification )






module.exports = { router };