const express =require("express");

const {body, param} = require("express-validator");
const { verifyToken } = require("../middlewares/validateToken");
const { createProperty, showMyProperty } = require("../controllers/PropertyController");


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
router.get("/myprop", verifyToken, showMyProperty )







module.exports = { router };