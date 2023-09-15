const nodemailer = require('nodemailer');
const userHelpers = require("../helpers/userHelpers")
const profileHelper = require('../helpers/profileHelper');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv').config();


const emailTokens = {};
const jwtSecret = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit random hexadecimal string

const email = 'nandhuraj308@gmail.com'
const forgotPassword = (async (req, res) => {
  const useremail = req.query.email
  const user = await userHelpers.getUserEmail(useremail)
  if (!user) {
    res.json({ message: 'user not found' });
  }
  else {
    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '60s' });
    emailTokens[email] = token;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    });

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: useremail,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ message: 'Error sending email' });
      } else {
        req.session.email = req.query.email
        res.json({ message: 'Email sent for password reset' });
      }
    });
  }
});



const resetPassword = ((req, res) => {
  const token = req.params.token;
  const email = jwt.verify(token, jwtSecret).email;
  if (emailTokens[email] === token) {
    res.render('./user/resetPassword',)
  } else {
    log('errorrrrrrrrr')
  }

})

const resetUserPassword = async (req, res) => {
  const email = req.session.email
  const updatedPassword = req.body.password
  const updated = await profileHelper.updatePassword(updatedPassword, email)
  if (updated) {
    res.redirect('/login')
  }
}

module.exports = {
  forgotPassword,
  resetPassword,
  resetUserPassword

}

