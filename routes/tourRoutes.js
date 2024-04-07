const express =require("express");

const { verifyToken } = require("../middlewares/validateToken");
const { createTour, getTour, updateTour, deleteTour } = require("../controllers/TourController");



const router = express.Router();


router.get("/:id",verifyToken, getTour )
router.post("/", verifyToken, createTour )
router.put("/:id", verifyToken, updateTour )
router.delete("/:id", verifyToken, deleteTour )






module.exports = { router };