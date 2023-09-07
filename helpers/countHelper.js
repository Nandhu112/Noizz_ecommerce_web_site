const Wishlist = require('../models/wishlist');
const Cart = require('../models/cart');
const cartHelpers = require("../helpers/cartHelper")
const wishlistHelpers = require("../helpers/wishlistHelper")

// const cartController = require('../controllers/cartController.js');
// const wishlistController = require('../controllers/wishlistController');


// const wishlistCount =(async(req,res)=>{
  
//     let userWishlist = await Wishlist.findOne({ user: req.session.user1._id });
//     let userWishlistCount=0
//     if(userWishlist){
//       userWishlistCount= await wishlistHelpers.getwishlistCount(req.session.user1._id)
//     }
//     return userWishlistCount
//   })

//   const cartCount =(async(req,res)=>{
//     let userCart = await Cart.findOne({ user: req.session.user1._id });  
//     let cartCount=0
//     console.log(userCart,'cart  chkkkkkkkkkkk');
//     if(userCart){
//        cartCount= await cartHelpers.getCartCount(req.session.user1._id)
  
//     }
//     return cartCount
//   })

  const cartCount = ((userId)=>{
    return new Promise (async(resolve,reject)=>{
        let userCart = await Cart.findOne({user:userId});  
        let cartCount=0
        console.log(userCart,'cart  chkkkkkkkkkkk');
        if(userCart){
           cartCount= await cartHelpers.getCartCount(userId)    
           console.log(cartCount,' chkkkkkkkkkkk  cartCount'); 
        }
        resolve(cartCount)
    })
  })


  const wishlistCount = ((userId)=>{
    return new Promise (async(resolve,reject)=>{
        let userWishlist = await Wishlist.findOne({user:userId});
        console.log(userWishlist,'chkkkk userWishlistCount');
        let userWishlistCount=0
        if(userWishlist){
          userWishlistCount= await wishlistHelpers.getwishlistCount(userId)
          console.log(userWishlistCount,'chkkkk userWishlistCount');
        }
        resolve(userWishlistCount)
    })
  })
  

  module.exports={
    wishlistCount,
    cartCount
    
  }