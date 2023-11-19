const express =require("express");

const { verifyToken } = require("../middlewares/validateToken");
const { createTour, getTour, updateTour, deleteTour } = require("../controllers/TourController");



const router = express.Router();


router.get("/",verifyToken, getTour )
router.post("/", verifyToken, createTour )
router.put("/", verifyToken, updateTour )
router.delete("/", verifyToken, deleteTour )






module.exports = { router };