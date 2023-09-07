
const userHelpers = require("../helpers/userHelpers")
const productHelper = require('../helpers/productHelper');
const profileHelper = require('../helpers/profileHelper');
const orderHelper = require('../helpers/orderHelper');
const wishlistHelpers = require("../helpers/wishlistHelper")
const countHelper = require("../helpers/countHelper")
const Cart = require('../models/cart');
const Order=require('../models/order')
const Wishlist = require('../models/wishlist');
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const { Readable } = require('stream');



const  getProfilePage= async (req, res) => {
    try {  
      const user=await req.session.user1
      console.log(user,'chkk user');
      const  cartCount= await countHelper.cartCount(req.session.user1._id)
      const  userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
      console.log(userWishlistCount,'chkkkkkkkkk userWishlistCount')
      const orders= await orderHelper.getOrderCount(user._id)

      res.render('./user/userProfilePage',{cartCount,user,orders,userWishlistCount});  
   
        // res.render('./user/userProfilePage',{cartCount,user});   
    }
    catch (error) {
        console.log(error.message);
      }
  }

  const manageAddress = async (req, res) => {
    try {
      const profile = await profileHelper.getProfile(req.session.user1._id)
      const address= profile.Address
      console.log(profile.Address.length,'chkkkkk addresssss');
      if(!profile.Address.length==0){
        res.render('./user/manageAddress', {address, profile,condition:true})
      }
      else{
      console.log(profile.Address, "in u-c manageAddress");    
      res.render('./user/manageAddress', { address,condition:false })
      }
 
    } catch (error) {
      console.log(error);
    }
  }
  const addAddress =async (req,res)=>{
    res.render('./user/addnewAddress')
  }

  const addNewAddress =async (req,res)=>{
    const userId =req.session.user1._id
    const data =req.body
    // console.log(req.body,"here");
    const status =await profileHelper.addAddress(data,userId)
    // console.log(status);
    if (status){
      res.redirect('/manageAddress')
    }else{
      res.redirect('/home')
    }
  }

  const editAddress =async (req,res)=>{ 
    const addressId = req.query.id
    const userId = req.session.user1._id
    // console.log(addressId,"addid",userId,"userId");
    const address = await  profileHelper.fetchAddress(userId,addressId)
    // console.log(address,"u-c addressfetched"); 
    res.render('./user/editAddress',{address})
  } 

  const updateAddress =async (req,res)=>{

    const addressId=req.body.id
    const userId=req.session.user1._id
   
    const updatedAddress={
     
      firstname:req.body.fname,
      lastname:req.body.lname,
      state:req.body.state,
      address1:req.body.address1,
      address2:req.body.address2,
      city:req.body.city,
      pincode:req.body.pincode,
      mobile:req.body.mobile,
      email:req.body.email,
  
    }

   const updated= await profileHelper.updateAddress(userId,addressId,updatedAddress)
  //  console.log(updated,"ll");
   if(updated){
    res.redirect('/manageAddress') 
   }
  }

  const deleteAddress = async (req,res)=>{
    console.log(" u-c deleteaddress herre");
    const userId =req.session.user1._id
    const addressId = req.query.id
    const firstName = req.query.fname
    const lastName = req.query.lname
     console.log(" u-c deleteaddress herre",userId,addressId);
    const status = await profileHelper.deleteAddress(userId,addressId,firstName,lastName)
    console.log(status);
    if (status){
      res.redirect('/manageAddress')
    }else{
      res.redirect('/home')  
    }
  
  }
  const  getaUserProfile= async (req, res) => {
    try {  
      const user=await req.session.user1
      console.log(user,'chkk user');
      

      const userCart = await Cart.findOne({ user: req.session.user1._id });  
      console.log(userCart,'cart  chkkkkkkkkkkk');
      if(userCart){
        const cartCount= await userHelpers.getCartCount(req.session.user1._id)
        console.log('cart  chkkkkkkkkkkk   '+cartCount);
        res.render('./user/userProfile',{cartCount,user});   
      }
    
   
        // res.render('./user/userProfilePage',{cartCount,user});   
    }
    catch (error) {
        console.log(error.message);
      }
  }

  const changePrimaryAddress = async (req,res)=>{
    console.log('chkkk changePrimaryAddress');
    await profileHelper.changePrimaryAddress(req.session.user1._id,req.body.addressId)
   
    }



    const orderPage= async(req,res)=>{
      try {
        let orders =await orderHelper.getOrders(req.session.user1._id)
        
        console.log("-------------",orders[0].products,"in u-c orderpage 0");
        console.log("-------------",orders[27].products,"in u-c orderpage 28");
       
        // console.log("-------------",orders[0].products,"in u-c orderpage");
        // console.log("-------------",orders,"in u-c orderpageeeeeee");
    
          res.render('./user/userOrderPage',{orders})
      } catch (error) {
        console.log(error);
      }
    }

    const getOrderInvoice= async (req,res)=>{
      // let result;
      try {
        const id = req.query.id
        userId = req.session.user._id;
    
        result = await orderHelper.invoiceGetOrder(id);
        console.log(result,"invoice")
        const date = result.date.toLocaleDateString();
        const product = result.products;
        // console.log(result,"inv2");
    
        const order = {
          id: id,
          total:parseInt( result.totalAmount),
          date: date,
          payment: result.paymentMethod,
          name: result.deliveryDetails.firstname,
          street: result.deliveryDetails.address1,
          locality: result.deliveryDetails.address2,
          city: result.deliveryDetails.city,
          state: result.deliveryDetails.state,
          pincode: result.deliveryDetails.pincode,
          product: result.products,
        };
       
    
        const products = order.product.map((product) => ({
          "quantity":parseInt( product.quantity),
          "description": product.product.Name,
          "tax-rate":0,
          "price": parseInt(product.price),
        }));
    
        console.log(order.product,"inv2");
    
      
        var data = {
          customize: {},
          images: {
            // logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
    
            background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
          },
    
    
          sender: {
            company: "Noizz",
            address: "Brototype",
            zip: "686633",
            city: "Maradu",
            country: "India",
          },
    
          client: {
            company: order.name,
            address: order.street,
            zip: order.pincode,
            city: order.city,
            // state:" <%=order.state%>",
            country: "India",
          },
          information: {
            number: order.id,
    
            date: order.date,
            // Invoice due date
            "due-date": "Nil",
          },
    
          products: products,
          // The message you would like to display on the bottom of your invoice
          "bottom-notice": "Thank you,Keep shopping.",
        };
         result= Object.values(result)
        
        
          easyinvoice.createInvoice(data, async  (result)=> {
            //The response will contain a base64 encoded PDF file
            console.log(result,"jjj11",data,"pdf11");
            if (result && result.pdf) {
              await fs.writeFileSync("invoice.pdf", result.pdf, "base64");
          
            
      
      
             // Set the response headers for downloading the file
             res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
             res.setHeader('Content-Type', 'application/pdf');
       
             // Create a readable stream from the PDF base64 string
             const pdfStream = new Readable();
             pdfStream.push(Buffer.from(result.pdf, 'base64'));
             pdfStream.push(null);
       
             // Pipe the stream to the response
             pdfStream.pipe(res);
            }else {
              // Handle the case where result.pdf is undefined or empty
              res.status(500).send("Error generating the invoice");
            }
      
            
          }).catch((err)=>{
            console.log(err,"errrrrrr")
          })
       
       
      } catch (error) {
        console.log(error)
      }
    }
  

module.exports={    
    getProfilePage,   
    manageAddress,
    addAddress,
    addNewAddress,
    editAddress,
    updateAddress,
    deleteAddress,
    getaUserProfile,
    changePrimaryAddress,
    orderPage,
    getOrderInvoice
    
}