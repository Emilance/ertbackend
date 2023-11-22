const express = require("express");
const { verifyToken } = require("../middlewares/validateToken");
const {  makePayment } = require("../controllers/PaymentController");

const router = express.Router();









router.post("/",  verifyToken, makePayment)



module.exports = { router }