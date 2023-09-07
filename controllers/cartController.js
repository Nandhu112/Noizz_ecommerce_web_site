const cartHelpers = require("../helpers/cartHelper")
const productHelper = require('../helpers/productHelper');
const countHelper = require("../helpers/countHelper")


const addToCart=async (req,res)=>{
    // console.log('chkkkkkkkkkk proId',req.params.id);
    // const productId = req.query.productId;
    // console.log(productId ,'ggggggggggggg');
   await cartHelpers.addToCart(req.params.id,req.session.user1._id).then((response)=>{    
    console.log(response,'chkkkkkkkk response');
      res.json({response:true})
    })     
}

const getCart=async (req,res)=>{
  
    try {
      


    const  cartCount= await countHelper.cartCount(req.session.user1._id) 
    const  userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)  
    if(cartCount==0){
      const data = {
        userWishlistCount:userWishlistCount,
        cartCount:cartCount
        // subTotal: subTotal     
      };
      res.render('./user/cart',data );  
    } 
    else{
      let products =await  cartHelpers.getCartProducts(req.session.user1._id)
      console.log (typeof products[0].product.Stock,'chk proooo')
      let total =await  cartHelpers.getTotal(req.session.user1._id)
      const data = {
        products: products,
        total: total, 
        userWishlistCount:userWishlistCount,
        cartCount:cartCount
        // subTotal: subTotal     
      };
  
         
      res.render('./user/cart',data );  
    }
       

    }
    catch (error) {
      console.log(error);
    }
  } 

  const changeQuantity=async (req,res)=>{
    // userHelpers.changeProductQuantity(req.body)

    try {
      // console.log(req.body.product,"chngeqty");
  const product= await productHelper.getProductById(req.body.product)
     
  const proStock=product.Stock
      // console.log(proStock,'chkk prostock')
  
      await cartHelpers.changeProductQuantity(req.body,proStock).then((response)=>{    
        console.log(response,"chngeqty22222");
        res.json(response)
      })

     
    }
    catch (error) {
      console.log(error);
    }
  }

  const  removeCartProduct=async (req,res,next)=>{
  
    try {
      // console.log(req.body,"removecart product");
     await cartHelpers.removeCartProduct(req.body).then((response)=>{
       
        res.json(response)
      })
    }
    catch (error) {
      console.log(error);
    }
  }


module.exports={
    addToCart,
    getCart,
    changeQuantity,
    removeCartProduct,
  
}