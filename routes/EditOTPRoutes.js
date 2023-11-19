const express =require("express");

const { verifyToken } = require("../middlewares/validateToken");
const { reqOTP, verifyOTP } = require("../controllers/VerifyEditOTPController");



const router = express.Router();


router.get("/",verifyToken, reqOTP )
router.post("/verify", verifyToken, verifyOTP )








module.exports = { router };