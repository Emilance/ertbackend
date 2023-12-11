
export const sendEmail = async ({ email }, res) => {

    try {
 
     
       const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: email,
          subject: 'Verify your email',
          html: `<p>Enter <b>${otp}</b> in your easyrent App and complete your verification</p> 
          <p>Note: This OTP will expire in the next 1 hours</p>`
       }
 
 
    
 
       await transporter.sendMail(mailOptions);
       return {
          status: "PENDING",
          message: " email sent successfully",
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
