const jwt = require("jsonwebtoken");

const generateToken = (payloadObj, expiresIn) => {
  return jwt.sign(payloadObj, process.env.TOKEN_KEY, {
    expiresIn: expiresIn,
  });
};

module.exports = { generateToken };
