const { UserOTPVerification } = require("../models/userOTPverification");
const { validateBody } = require("../utils/utilityFunctions");
const { transporter } = require("../utils/nodemailer.config");
require('dotenv').config()
const bcrypt = require("bcrypt");
const User = require("../models/User");



 

const reqOTP = async(req, res) =>{
   const {user_id, email } = req.user
   try {
    const OTPresp  =await sendOTPVerificationMail({_id : user_id , email}, res)
    res.status(200).json({
      message:"Email Sent successfully",
      otptime : OTPresp.otpData.createdAt,

    })
   } catch (error) {
      return res
      .status(500)
      .json({ message: error.message, error: "OTP request failed" });   }
}



 
 
const sendOTPVerificationMail = async ({ _id, email }, res) => {
 
    try {
 
       //Generate token
       const otp = Math.floor(10000 + Math.random() * 90000)
       const stringOTP = otp.toString()
       const mailOptions = {        
          from: process.env.AUTH_EMAIL,
          to: email,
          subject: 'Verify your email',
          html: `<p>Enter <b>${otp}</b> in your easyrent App To Proceed to editing your account Information</p> 
          <p>Note: This OTP will expire in the next 1 hours</p>`
 
       }

       const hashedOTP = await bcrypt.hash(stringOTP, 10)
 
      const otpData =  await UserOTPVerification.create({
          userId: _id,
          otp: hashedOTP,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000
       })
       await transporter.sendMail(mailOptions);
       return {
          status: "PENDING",
          message: " verification otp email sent",
          otpData,
          data: {
             userId: _id,
             email
          },
       }
    
    } catch (error) {
      console.log(error)
       return {
          status: "FAILED",
          message: error.message
       }    
    }
 }

  


const verifyOTP = async (req, res) => {
    const userid = req.user.user_id
     const { otp } = req.body
     if (validateBody(req, res)) {
       return;
     }
     try {
        if (!otp) {
           throw Error("Empty otp details  not allowed!!")
        } else {
           const userRecords = await UserOTPVerification.find({ userId: userid })
              console.log(userRecords)

           if (userRecords <= 0) {
              throw new Error("User doesn't exist")
           } else {
              const { expiresAt } = userRecords[0]
              const hashedOTP = userRecords[0].otp
              if (expiresAt < Date.now()) {
                 throw new Error("otp has expired try to resend")
              } else {
                 const validatedOTP = await bcrypt.compare(otp, hashedOTP)
                 if (!validatedOTP) {
                     throw new Error("Enter  a valid otp")
                 } else {
                    await User.updateOne({ _id: userid }, { emailVerified: true })
                    await UserOTPVerification.findByIdAndDelete(userRecords[0]._id);
                     res.status(202).json({
                       status: "SUCCESS",
                       message: "User email verified",
                       status_code: 200
                    })
                 }
  
              }
           }
        }
     } catch (error) {
      await UserOTPVerification.deleteMany({userId : userid})

         return res
         .status(500)
         .json({ message: error.message, error: "verification failed" });
    
     }
  }
  
 
 
 
  module.exports = {reqOTP , verifyOTP}