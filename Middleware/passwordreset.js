const nodemailer = require("nodemailer");
const UserModel=require("../models/userModel")
module.exports= {

 sendResetPassword: async (fullName,email,token)=>{
    try{

      let transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
      
        auth: {
          user: process.env.ACCOUNT_NAME,
          pass: process.env.ACC_PASS,
        },
      });
      const mailOptions = {
       
        from: process.env.ACCOUNT_NAME,
        to:  email,
        subject: "Link to reset password: ",
        html: '<p>Hi '+fullName+',Forgot password?</p> <p> Click the link below to reset password </p><a href="http://localhost:3000/resetpassword?token='+token+'">Click here</a>' // html body
      }
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log(mailOptions.html);
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      })
  
    } catch (error) {
      console.log(error);
    }
  }
  
 
}