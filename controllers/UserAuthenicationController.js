
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generatejwt");
const User = require("../models/User");
const { UserOTPVerification } = require("../models/userOTPverification");
const { validateBody } = require("../utils/utilityFunctions");
const { transporter } = require("../utils/nodemailer.config");
require('dotenv').config()


// const createAdmin = async (req, res) => {


//    try {
//         let password = "afolabi123"
//    const encryptedPassword = await bcrypt.hash(password, 10)

//    const user = await User.create({
//      role:'admin',
//      email: " afolabidave9@gmail.com",
//      password: encryptedPassword
//   })
//    res.send("api is  working perfectly");
//    } catch (error) {
      
//    }
 
//  }
 



//Controller function to  signup new user
const signUp = async (req, res) => {
    //get andd validate user input
    const { email, role, password } = req.body
    if (validateBody(req, res)) {
        return;
      }
    try {
 
       //check if user already exist
       const existingUser = await User.findOne({ email })
       if (existingUser) {
          // console.log(existingUser)
          return res.status(409).json({message :"User with this email already exist"})
       } else {
 
 
          //Encrypt user password
          const encryptedPassword = await bcrypt.hash(password, 10)
 
          //add user to DB
          const user = await User.create({
             role,
             email: email.toLowerCase(),
             password: encryptedPassword
          })
        
          // Create tokens
          const accessToken = generateToken(
            { user_id: user._id, email: user.email , role: user.role },
            "3d"
          );
          const refreshToken = generateToken(
            { user_id: user._id, email: user.email , role: user.role },
            "7d"
          );
       
          const resp = await sendOTPVerificationMail(user, res)
          if(resp.status == "FAILED"){
            console.log(resp.message)
            return res.status(500).json({message : resp.message})
          }
          res.status(201).json({
             user,
             accessToken,
             refreshToken,
             otptime : resp.otpData.createdAt,
             role,
             message: "User created successfully",
          })
       }
 
    } catch (error) {
        return res
        .status(500)
        .json({ message: "sign up failed", error: error.message });
    }
    
 }
 





// Controller function to handle user login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (validateBody(req, res)) {
   return;
 }
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "No User with Email found" });
    }
    // Verify the password
    const hashedpassword = await bcrypt.compare(password, user.password);
    if (!hashedpassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    // Update the last_login timestamp
    user.last_login = new Date();
    await user.save();
    // Create tokens
    const accessToken = generateToken(
      { user_id: user._id, email: user.email, role: user.role },
      "7d"
    );
    const refreshToken = generateToken(
      { user_id: user._id, email: user.email , role: user.role},
      "7d"
    );
    return res.status(200).json({
      user,
      accessToken,
      refreshToken,
      role: user.role,
      message: "Authentication successful",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};







const logout = async (req, res) => {
  try {
    // Clear the user's cookie.
    res.clearCookie("accessToken");
    res.clearCookie("user");

    // Return a success message.
    return res.json({ message: "Successfully logged out." });
  } catch (error) {
    // Log the error to the console.
    console.error(error);
    // Return a friendly message to the user.
    return res.json({ message: "An error occurred while logging out." });
  }
};







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
          if (userRecords <= 0) {
            return res.status(404).json({ message: "OTP doesn't exist"});
          } else {
             const { expiresAt } = userRecords[0]
             const hashedOTP = userRecords[0].otp
             if (expiresAt < Date.now()) {
               return res.status(400).json({ message: "otp has expired try to resend" });
             } else {
                const validatedOTP = await bcrypt.compare(otp, hashedOTP)
                if (!validatedOTP) {
                  return res.status(400).json({ message: "Enter  a valid otp" });
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
        return res
        .status(500)
        .json({ message: error.message, error: "verification failed" });
   
    }
 }
  

 const resendAcctOTP = async (req, res) => {
   const {user_id} = req.user
      try {
         const user = await User.findById(user_id) 
         const userRecords = await UserOTPVerification.find({ userId: user_id })
         console.log(userRecords)
         if(userRecords  && userRecords.length > 0){
            await UserOTPVerification.findByIdAndDelete(userRecords[0]._id);
         }
         const resp = await sendOTPVerificationMail(user, res)
         if(resp.status == "FAILED"){
           console.log(resp.message)
           return res.status(500).json({message : resp.message})
         }
         res.status(200).json({
            otptime : resp.otpData.createdAt,
            message: "OTP resent successfully"
         })
      } catch (error) {
         console.log(error.message)
         return res
         .status(500)
         .json({ message: error.message, error: "verification failed" });
      }

 }




module.exports = { login, logout ,signUp, verifyOTP ,resendAcctOTP };

const sendOTPVerificationMail = async ({ _id, email }, res) => {

    try {
 
       //Generate token
       const otp = Math.floor(10000 + Math.random() * 90000)
       const stringOTP = otp.toString()
       const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: email,
          subject: 'Verify your email',
          html: `<p>Enter <b>${otp}</b> in your easyrent App and complete your verification</p> 
          <p>Note: This OTP will expire in the next 1 hours</p>`
 
       }
 
       const hashedOTP = await bcrypt.hash(stringOTP, 10)
 
      const otpData = await UserOTPVerification.create({
          userId: _id,
          otp: hashedOTP,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3600000
       })
 
       await transporter.sendMail(mailOptions);
       return {
          status: "PENDING",
          message: "verification otp email sent",
          otpData,
          data: {
             userId: _id,
             email
          },
       }
    
    } catch (error) {
         await User.findByIdAndDelete(_id) ;
       return {
          status: "FAILED",
          message: error.message
       }
    
    }
 }

 