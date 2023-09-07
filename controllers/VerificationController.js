const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
const userHelpers = require("../helpers/userHelpers")
const profileHelper = require('../helpers/profileHelper');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv').config();




const emailTokens = {};
const jwtSecret = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit random hexadecimal string

const email='nandhuraj308@gmail.com'


const forgotPassword=(async(req,res)=>{    
    const useremail = req.query.email
    console.log(email,'chkkkk emaillllll')
    const user=await userHelpers.getUserEmail(useremail)   

    if(!user){
        res.json({ message: 'user not found' });
    }
    else{

// const secretKey = 'yourSecretKey'; // Replace with your secret key
const token = jwt.sign({ email }, jwtSecret, { expiresIn: '60s' });
 emailTokens[email] = token;

console.log( token,'Generated token:');


const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service provider    jdIMCw4eTcDWYVsKE7aB851vvFuE33
  auth: {
    user: process.env.AUTH_EMAIL, // replace with your email
    pass: process.env.AUTH_PASS // replace with your password or app password
  }
});

const mailOptions = {
  from: process.env.AUTH_EMAIL,
  to: useremail,
  subject: 'Password Reset',
  text:  `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        // console.error(error);
        res.status(500).json({ message: 'Error sending email' });
    } else {
        // console.log('Email sent: ' + info.response);
       
       console.log( req.query.email,'chkkk inside emaillllllll')
        req.session.email=req.query.email
        res.json({ message: 'Email sent for password reset' });
    }
  });
 }
});
        


const resetPassword =((req,res)=>{
    const token = req.params.token;
    const email = jwt.verify(token, jwtSecret).email;
  
    // Check if the token matches the stored token
    if (emailTokens[email] === token) {
        res.render('./user/resetPassword',)
    } else {
      log('errorrrrrrrrr')     
    }

})

// const resetPassword =((req,res)=>{
//     res.render('./user/resetPassword',)
// })


// const resetUserPassword  =async (req,res)=>{ 
//     const password=req.body.password
//     console.log(password,'chkkkkkkk passssssss')
//     // const address = await  profileHelper.fetchAddress(userId,addressId)
//     // console.log(address,"u-c addressfetched"); 
//     // res.render('./user/editAddress',{address})
//   } 

  const resetUserPassword =async (req,res)=>{    

    // const password=req.body.password
    const email=req.session.email
    // console.log(email,'chkkkkkk emaill111111111111')

    const updatedPassword=req.body.password
    console.log(updatedPassword,'chkkkkkkk passssssss')

   const updated= await profileHelper.updatePassword(updatedPassword,email)
   console.log(updated,"ll");
   if(updated){
    res.redirect('/login') 
   }
  }

module.exports={
    forgotPassword,
    resetPassword,
    resetUserPassword

}

