const express = require("express");

const { body, param } = require("express-validator");
const { signUp, logout, login, verifyOTP } = require("../controllers/UserAuthenicationController");
const { getAll, show, destroy, update, showMyDetail } = require("../controllers/UserController");
const { verifyToken } = require("../middlewares/validateToken");
const upload = require("../middlewares/multer");


const router = express.Router();
const validationParam = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .optional()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .optional()
    .withMessage("Password must be at least 6 characters long"),
  body("firstName").notEmpty().optional().trim(),
  body("lastName").notEmpty().optional().trim(), 
  body("emailVerified").optional().isBoolean(),
  body("role").optional().isString(),
  body("password").optional().isString().trim(),
  body("bankDetails.bankName").optional().isString(),
  body("bankDetails.acctName").optional().isString(),
  body("bankDetails.acctNumber").optional().isNumeric(),


];

//store user
router.post("/", validationParam, signUp);

// //show all user
router.get("/", verifyToken, getAll);
router.get("/mydetails", verifyToken, showMyDetail);


router.post('/verifyotp', verifyToken,
[ body("otp")
.isLength({ min: 5 })
.withMessage("otp must be  5 characters long"),] ,
verifyOTP)

//show user
router.get(
  "/:id",
  verifyToken,
  [param("id").isMongoId().withMessage("Invalid user ID")],
  show
);

router.put('/', verifyToken,   upload.single("profilePicture"), update)

// //destroy user
router.delete(
  "/:id",
  verifyToken,
  [param("id").isMongoId().withMessage("Invalid user ID")],
  destroy
);

//login user
router.post("/login", login);

//logout
router.post("/logout", verifyToken, logout);

module.exports = { router };
