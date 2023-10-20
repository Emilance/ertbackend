const jwt = require("jsonwebtoken");


const verifyToken = async (req, res, next) => {
  const bearerToken = await req.body.token || req.query.token || req.headers["authorization"]

  if (!bearerToken) {
    return res.status(403).send("a token is required for authentication")
  }
  try {
    const token = bearerToken.substring(7)
    const decoded = await jwt.verify(token, process.env.TOKEN_KEY)
    req.user = decoded
  } catch (error) {
    return res.status(401).send("Invalid Token")
  }

  return next()
}


module.exports = {verifyToken};