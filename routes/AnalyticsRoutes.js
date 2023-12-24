const express =require("express");

const { verifyToken } = require("../middlewares/validateToken");
const { getAnalytics } = require("../controllers/AnalyticsController");



const router = express.Router();


router.get("/",verifyToken, getAnalytics )






module.exports = { router };