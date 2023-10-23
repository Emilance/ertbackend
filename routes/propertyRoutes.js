const express =require("express");

const {body, param} = require("express-validator");
const { verifyToken } = require("../middlewares/validateToken");
const { createProperty, showMyProperty, showSingleProperty, deleteProperty, showAllProperties } = require("../controllers/PropertyController");


const router = express.Router();
const validationParam = [

    body('apartment')
    .trim()
    .isString()
    .withMessage('Apartment must be a string')
    .notEmpty()
    .withMessage('Apartment field is required'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number'),
  ];




router.post("/", verifyToken,  validationParam, createProperty )

router.get("/me", verifyToken, showMyProperty )
router.get("/showAll", showAllProperties )

router.get("/:id", verifyToken, showSingleProperty )

router.delete("/:id", verifyToken, deleteProperty )





module.exports = { router };