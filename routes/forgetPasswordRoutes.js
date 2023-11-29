const express =require("express");

const { verifyToken } = require("../middlewares/validateToken");
const { ForgetPassword, ChangePassword } = require("../controllers/ForgetPassword");


const router = express.Router();


router.post("/", ForgetPassword )

router.post("/update/:id", ChangePassword )







module.exports = { router };