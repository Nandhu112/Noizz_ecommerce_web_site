const Wishlist = require('../models/wishlist');
const Cart = require('../models/cart');
const cartHelpers = require("../helpers/cartHelper")
const wishlistHelpers = require("../helpers/wishlistHelper")



  const cartCount = ((userId)=>{
    return new Promise (async(resolve,reject)=>{
        let userCart = await Cart.findOne({user:userId});  
        let cartCount=0
    
        if(userCart){
           cartCount= await cartHelpers.getCartCount(userId)    
      
        }
        resolve(cartCount)
    })
  })


  const wishlistCount = ((userId)=>{
    return new Promise (async(resolve,reject)=>{
        let userWishlist = await Wishlist.findOne({user:userId});
      
        let userWishlistCount=0
        if(userWishlist){
          userWishlistCount= await wishlistHelpers.getwishlistCount(userId)
      
        }
        resolve(userWishlistCount)
    })
  })
  

  module.exports={
    wishlistCount,
    cartCount
    
  }