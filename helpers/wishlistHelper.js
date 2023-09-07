const Wishlist = require('../models/wishlist');
// const Cart = require('../models/cart');
const mongoose = require('mongoose');
const connectDB = require("../config/connections");

const addToWishlist = (proId, userId) => {
    console.log('chkk wishlist hpr');
    let proObj = {
      item: proId,

    }
    return new Promise(async (resolve, reject) => {
      console.log(userId, "addtowishlist");
      try {
        let userwishlist = await Wishlist.findOne({ user: userId });
        console.log(userwishlist ,'chk  userwishlist ');
        if (userwishlist) {
          console.log(userwishlist,"userwishlist");
          try {
            console.log("proexisst");
            // const proExist =userwishlist.products.some(product => product.item.toString() === proId.toString());
            const proExist = userwishlist.products.some(product => product.toString() === proId.toString());
            console.log(proExist,"proexisst");

            if (proExist) {
              console.log("if   proexisst");
              await Wishlist.updateOne(
                {user:(userId) },
                {
                  $pull: { 'products': proId}
                } 
              ).then(() => {
                resolve()
                }) 
                .catch((err) => {
                console.error(err);  
                })
            }
            else{

              console.log("chkk not proExist");
              await Wishlist.updateOne(
              { user: userId },
              {
                $push: { products: proId }
              }
              )
              .then(() => {
              resolve()
              })
              .catch((err) => {
              console.error(err);
              }) 
            }
          } catch (error) {
            console.log("Failed to update cart:", error);
            reject(error);
          }
        }
        else {
          console.log("chkk add new userr");
            let WishlistObj = {
                user: userId,
                products: proId
              };

          let newWishlist = new Wishlist(WishlistObj);
          await newWishlist.save();
          resolve();
        }
      } catch (error) {
        console.log("Failed to add to cart:", error);
        reject(error);
      }
    });
  }


  const getwishlistProducts = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const WishlistItems = await Wishlist.aggregate([
          {
            $match: { user: mongoose.Types.ObjectId.createFromHexString(userId) }
          },
          {
            $lookup: {
              from: 'products',
              localField: 'products',
              foreignField: '_id',
              as: 'productDetails'
            }
          },
          {
            $project: {
              _id: 0, // Exclude _id field from the output
              productDetails: 1 // Include the productDetails field in the output
            }
          }
        ]).exec();

  
        resolve(WishlistItems[0].productDetails); // Return the list of product details
      } catch (error) {
        reject(error);
      }
    });
  }

  const removeWishlistProduct=(details,userId)=>{
    return new Promise (async (resolve,reject)=>{
    await Wishlist.updateOne(
      {
        user:userId},     
      {
        $pull: { 'products': details.product}
        // $pull:{products:{item:(details.product)}}
      }	
      ).then((response)=>{
        resolve({removeProduct:true})
      })
      .catch((err) => {
        console.error(err);
        reject(err);
        })
    });
  }

  
  const getwishlistCount=(userId)=>{
    console.log('chkkkkkkkkk getwishlistCount hpr');
    return new Promise (async(resolve,reject)=>{
       try {
        const  user =await Wishlist.find({ 
          user: userId })
        // console.log(user,'chkkkkkkkkk UsEr222');
        if(user){       
          // console.log(user[0].products.length,'chkkkkkkkkk UsEr.....');   
          let count=user[0].products.length
          console.log(count,'chkkkkkkkkk count222');
          // for(let i=0;i<user[0].products.length;i++){
          //   count+=user[0].products[i].quantity
          // }
          resolve(count)
        }
       } catch (error) {
             
       }
    })
  }
  


module.exports={
    addToWishlist,
    getwishlistProducts,
    removeWishlistProduct,
    getwishlistCount

}