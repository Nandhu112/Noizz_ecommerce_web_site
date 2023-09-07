

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


const landingPage= async (req, res) => {
  // console.log('check home222222222..............');
  try {  
    try{
    
      if(req.session.user){
        // console.log('check home..............');
        res.redirect('/home')
      }
           
      const promises = [
        productHelper.getGuitars_Product(),
      
      ];

      Promise.all(promises)
      .then(async(GProducts ) => {
        let GuitarProducts=GProducts[0]
        const banner=await bannerHelper.bannerListHelper()
        // console.log(GuitarProducts,"ppppp");
        res.render('./user/landingPage', { GuitarProducts ,banner});
      })
      .catch((error) => {
        console.log('Failed to retrieve products:', error);
        // Handle error
      });

    }
    catch (err) {
      console.log(err);
      console.log("error occured !!!!!here @get home");
      res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
}
catch (error) {
  console.log(error.message);
}
}


const  usersignup= async (req, res) => {
  try {  
      res.render('./user/userSignup',);   
  }
  catch (error) {
      console.log(error.message);
    }
}
   
const verify =async(req,res)=>{
    try {
        // console.log("verify fn",req.body);   
     const mobileNumber=req.body.mob
    //  console.log("verify fn",mobileNumber);
     req.session.mob=req.body.mob
     
     client.verify.v2
     .services(verifySid)
     .verifications.create({ to: "+91"+ mobileNumber, channel: 'sms' })
     
     .then((verification) => {
       console.log(verification.status);
    //    console.log("verify fn",mobileNumber);
       res.redirect('/verifyOtp')
     //   res.render('verify_otp',{mobileNumber});
     // res.send('hihihiii')
     })
     .catch((error) => {
       console.log(error);
       res.send('Error occurred during OTP generation');
     });
    } catch (error) {
     
    }
 }

 const verifyOtpPage =async(req,res)=>{

    try {
        res.render('./user/verifyOtp')
    } catch (error) {
      console.log(error);
    }
}


 const verifyOtp =async(req,res)=>{
    try {
        const mobile=req.session.mob
const otpCode= req.body.otp
// let verified=false;
console.log(otpCode,"otp",mobile,"mobile")
  client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to:"+91"+ mobile , code: otpCode })
    .then((verificationCheck) => {
      console.log(verificationCheck.status);   
      req.session.verified=true
      res.redirect('/signup')

    })
    .catch((error) => {
      console.log(error);
      res.send('Error occurred during OTP verification');
    });
    } catch (error) {
      console.log(error);
    }
}

const signup =async(req,res)=>{
    try {
  
      if(req.session.verified){
        res.render('./user/signup')
        req.session.verified=false
      }
      else{
        req.session.verified="verification failed"
        res.redirect('/usersignup')
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  const userSignup=async (req,res)=>{
    try{
        const name=req.body.name
        const email=req.body.email
        const password=req.body.password

        const mobile=req.session.mob
     
         // const { user:name, email,mobile, password } = req.body
         let user = { name,email,mobile, password }
       // console.log(req.body);
        await  userHelpers.addUser(user, stat => {
             if (stat === "DONE") {
           // res.redirect(`/login`)
           res.render('./user/login',{email})
       }
             else if (stat === "USER_ALREADY_EXISTS")
                 res.redirect("/login")
         })  
    }
    catch (error) {
        console.log(error.message);
      }

}

const login=async (req,res)=>{
  
  try{  
        res.render('./user/login')
  }
  catch (error) {
      console.log(error.message);
    }
}


const getuserlogin=async(req,res)=>{                    
  try {
    const email = req.body.email;
    const password=req.body.password
    // let user = { email, password }
    
   console.log("at post login");
    const user = await userHelpers.getUsers({Email: email,Password:password });
    console.log(user,"chkkk user ");
    // const blockedStatus=user.blocked
    
    if (!user) {
      // Handle the case when the product is not found
      return res.redirect('/');
    }
    if (user){
      // console.log('chkkkkk user');
      req.session.user=true
      req.session.user1=user  

      console.log(user+'chk usewr cntr hplr home');
      res.redirect('/home');
      // console.log(user.Blocked,"userblock");
      
    }
    
  } catch (err) {
    console.log(err);
    console.log("error occured !!!!!here @post login");
    res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
  }

}

const home= async (req, res) => {
  try {  
    try{
      // if(req.session.user){   
        console.log('checkkkkkkkk usrrrrr');
      const promises = [
        productHelper.getGuitars_Product(), 
      ];

      Promise.all(promises)
      .then(async(GProducts ) => {
        let GuitarProducts=GProducts[0]  
        const  userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
        console.log(userWishlistCount);
        const  cartCount= await countHelper.cartCount(req.session.user1._id)
        const banner=await bannerHelper.bannerListHelper()
        console.log(banner);
        res.render('./user/home', { GuitarProducts,cartCount,userWishlistCount,banner});
      
      })  
      .catch((error) => {
        console.log('Failed to retrieve products:', error);
 
      });
    }
    catch (err) {
      console.log(err);
      console.log("error occured !!!!!here @get home");
      res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
}
catch (error) {
  console.log(error.message);
}
}

const logout=async (req,res)=>{
    try {
        req.session.user=false
  res.redirect('/')
    }
    catch (error) {
        console.log(error.message);
      }
}

  const checkOut =async (req,res)=>{
    try {
      console.log("in checkout u-c");
      const user=req.session.user1
      let products=await userHelpers.getCartProductList(user._id)
      let totalPrice= await userHelpers.getTotal(user._id)
      await userHelpers.addAddress(req.body,user._id)
      await userHelpers.placeOrder(req.body,products,totalPrice,user._id).then((response)=>{
        res.json({checkoutcomplete:true})
    
      })
      console.log("here");
    } catch (error) {
      console.log(error);
    }
    }

    const orderSuccess= async(req,res)=>{
      try {
        res.render('./user/orderConfirmed')      
      } catch (error) {
        console.log(error);
      }
    
    }    

   
    
   
module.exports={
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