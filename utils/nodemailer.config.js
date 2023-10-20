const nodemailer = require("nodemailer")
require('dotenv').config()

const user = process.env.AUTH_EMAIL
const pass = process.env.USER_PASS


const transporter = nodemailer.createTransport({
    service:"gmail",
    port:465,
    secure :true,
    logger: true,
    debug: true,
    secureConnection:false,
    auth:{
        user: user,
        pass: pass
    },
    tls:{
        rejectUnauthorized:true
      }
})


module.exports ={ transporter }