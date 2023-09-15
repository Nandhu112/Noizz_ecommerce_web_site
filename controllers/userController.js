const userHelpers = require("../helpers/userHelpers")
const productHelper = require('../helpers/productHelper');
const countHelper = require("../helpers/countHelper")
const bannerHelper = require('../helpers/bannerHelper');
const Cart = require('../models/cart');
const Wishlist = require('../models/wishlist');

const dotenv = require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require('twilio')(accountSid, authToken);


const landingPage = async (req, res) => {
  try {
    try {
      if (req.session.user) {
        res.redirect('/home')
      }

      const promises = [
        productHelper.getGuitars_Product(),

      ];

      Promise.all(promises)
        .then(async (GProducts) => {
          let GuitarProducts = GProducts[0]
          const banner = await bannerHelper.bannerListHelper()
          res.render('./user/landingPage', { GuitarProducts, banner });
        })
        .catch((error) => {

        });

    }
    catch (err) {

      res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const usersignup = async (req, res) => {
  try {
    res.render('./user/userSignup',);
  }
  catch (error) {

    res.render("error-404");
  }
}

const verify = async (req, res) => {
  try {
    const mobileNumber = req.body.mob
    req.session.mob = req.body.mob

    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: "+91" + mobileNumber, channel: 'sms' })
      .then((verification) => {
        res.redirect('/verifyOtp')
      })
      .catch((error) => {

        res.send('Error occurred during OTP generation');
      });
  } catch (error) {
    res.render("error-404");

  }
}

const verifyOtpPage = async (req, res) => {

  try {
    res.render('./user/verifyOtp')
  } catch (error) {

    res.render("error-404");
  }
}

const verifyOtp = async (req, res) => {
  try {
    const mobile = req.session.mob
    const otpCode = req.body.otp
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: "+91" + mobile, code: otpCode })
      .then((verificationCheck) => {
        req.session.verified = true
        res.redirect('/signup')

      })
      .catch((error) => {

        res.send('Error occurred during OTP verification');
      });
  } catch (error) {

    res.render("error-404");
  }
}

const signup = async (req, res) => {
  try {

    if (req.session.verified) {
      res.render('./user/signup')
      req.session.verified = false
    }
    else {
      req.session.verified = "verification failed"
      res.redirect('/usersignup')
    }

  } catch (error) {

    res.render("error-404");
  }
}

const userSignup = async (req, res) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const mobile = req.session.mob
    let user = { name, email, mobile, password }
    await userHelpers.addUser(user, stat => {
      if (stat === "DONE") {
        res.render('./user/login', { email })
      }
      else if (stat === "USER_ALREADY_EXISTS")
        res.redirect("/login")
    })
  }
  catch (error) {

    res.render("error-404");
  }
}

const login = async (req, res) => {

  try {
    res.render('./user/login')
  }
  catch (error) {

    res.render("error-404");
  }
}

const getuserlogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password
    const user = await userHelpers.getUsers({ Email: email, Password: password });
    if (!user) {
      return res.redirect('/');
    }
    if (user) {
      req.session.user = true
      req.session.user1 = user
      res.redirect('/home');

    }

  } catch (err) {

    res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
  }

}

const home = async (req, res) => {
  try {
    try {
      const promises = [
        productHelper.getGuitars_Product(),
      ];
      Promise.all(promises)
        .then(async (GProducts) => {
          let GuitarProducts = GProducts[0]
          const userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
          const cartCount = await countHelper.cartCount(req.session.user1._id)
          const banner = await bannerHelper.bannerListHelper()
          res.render('./user/home', { GuitarProducts, cartCount, userWishlistCount, banner });

        })
        .catch((error) => {

          res.render("error-404");

        });
    }
    catch (err) {

      res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const logout = async (req, res) => {
  try {
    req.session.user = false
    res.redirect('/')
  }
  catch (error) {

    res.render("error-404");
  }
}

const checkOut = async (req, res) => {
  try {
    const user = req.session.user1
    let products = await userHelpers.getCartProductList(user._id)
    let totalPrice = await userHelpers.getTotal(user._id)
    await userHelpers.addAddress(req.body, user._id)
    await userHelpers.placeOrder(req.body, products, totalPrice, user._id).then((response) => {
      res.json({ checkoutcomplete: true })

    })
  } catch (error) {

    res.render("error-404");
  }
}
const orderSuccess = async (req, res) => {
  try {
    res.render('./user/orderConfirmed')
  } catch (error) {

    res.render("error-404");
  }

}


module.exports = {
  landingPage,
  usersignup,
  verify,
  verifyOtp,
  verifyOtpPage,
  signup,
  userSignup,
  login,
  getuserlogin,
  home,
  logout,
  checkOut,
  orderSuccess,



}