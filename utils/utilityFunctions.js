const { validationResult } = require("express-validator");
const fs = require("fs");

//Validate Request Body
const validateBody = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If validation errors occur, delete the  uploaded  file (if any)
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ message: errors.array()[0].msg });
  }
};

module.exports = { validateBody };
