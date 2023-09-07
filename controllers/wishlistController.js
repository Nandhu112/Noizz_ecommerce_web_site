const wishlistHelpers = require("../helpers/wishlistHelper")
const countHelper = require("../helpers/countHelper")

const addToWishlist=async (req,res)=>{
    // console.log('chkkkkkkkkkk proId',req.params.id);
    const productId = req.params.id;
    console.log(productId ,'ggggggggggggg');
    wishlistHelpers.addToWishlist(req.params.id,req.session.user1._id).then((result)=>{
        console.log(result,'chkkk final result');
        res.json({response:true})
    })           
        
}

const getWishlist=async (req,res)=>{
  
    try {

      const  cartCount= await countHelper.cartCount(req.session.user1._id) 
      const  userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)

      let products =await  wishlistHelpers.getwishlistProducts(req.session.user1._id).then((products)=>{
        console.log(products, 'products in ctr');
        res.render('./user/wishlist', {products,cartCount,userWishlistCount });  
      })

    }
    catch (error) {
      console.log(error);
    }
  } 

  const  removewishlistProduct=async (req,res,next)=>{
  
    try {
      // console.log(req.body,"removecart product");
      const user=req.session.user1
     await wishlistHelpers.removeWishlistProduct(req.body,user).then((response)=>{
       
        res.json(response)
      })
    }
    catch (error) {
      console.log(error);     
    }
  }


module.exports={
    addToWishlist,
    getWishlist,
    removewishlistProduct,
  
}