const User = require("../models/User")
const bcrypt = require("bcrypt");
const { transporter } = require("../utils/nodemailer.config");
require("dotenv").config();


const ForgetPassword = async(req, res) => {
   const {email} = req.body
    try {
        const  userArr = await User.find({email }) 
        const resp = await sendChangePassLinkMail({ _id :userArr[0]._id, email})
        if(resp.status == "FAILED"){
         console.log(resp.message)
         return res.status(500).json({message : resp.message})
       }

       res.status(200).json({message: "chnage passwword link sent successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error creating the notification",  error : error.message });
    }


}

const ChangePassword = async (req, res) => {
    const {id} = req.params
   
    try {
      const updateData = req.body;
      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
  
      if (updateData.password) {
        const encryptedPassword = await bcrypt.hash(updateData.password, 10);
        user.password = encryptedPassword;
      }
  

  
      // Update the 'updated_at' field with the current timestamp
      user.updated_at = new Date();
  
      // Save the updated user
      const updatedUser = await user.save();
  
      // Send response with updated user and a success message
      return res.status(200).json({
        user: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: "Failed to update user", message: error.message });
    }
  };
  
  
  

module.exports ={ForgetPassword , ChangePassword}
const sendChangePassLinkMail = async ({ _id, email }) => {

    try {
 
       const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: email,
          subject: 'Change password link',
          html: `<p>Click to Reset your password on Ert<a href="${process.env.CLIENT_URL}/newpassword/${_id}"><b>Change Password</b></a> </p>`
       }
 
 
 
       await transporter.sendMail(mailOptions);
       return {
          status: "PENDING",
          message: "Change Password link Sent to your Email",
          data: {
             userId: _id,
             email
          },
       }
    
    } catch (error) {
       return {
          status: "FAILED",
          message: error.message
       }
    
    }
 }