const orderHelper = require('../helpers/orderHelper')               
const cartHelpers = require("../helpers/cartHelper")
const walletHelper = require("../helpers/walletHelper")
const profileHelper = require('../helpers/profileHelper') 
const dashboardHelper = require('../helpers/dashboardHelper') 
const categoyHelpers = require('../helpers/categoryHelper');
const productHelper = require('../helpers/productHelper');
const countHelper = require("../helpers/countHelper")

const checkStock =async (req,res)=>{
  productHelper.checkStock(req.session.user1._id).then((response)=>{
    console.log(response,"check stock");
    res.json(response)
  })
  }

const placeOrder = async (req, res) => {
  console.log('chkkkkkkk checkOUut111111')
    try {
  
    // if(req.session.user){
      const promises = [
        cartHelpers.getTotal(req.session.user1._id),
        cartHelpers.getSubTotal(req.session.user1._id),
        orderHelper.getAddress(req.session.user1._id),
        cartHelpers.getCartProducts(req.session.user1._id),
        walletHelper. getWallet(req.session.user1._id)
      ];
      
      Promise.all(promises)
      .then(([total,subTotal,address,cartItems,wallet]) => {
        console.log('chkkkkkkk checkOUut')
        res.render('./user/checkoutPage',{total,subTotal,address,cartItems,wallet})
        // res.render('s1',{total,subTotal,address}) 
      })
      .catch((error) => {
        console.log('Failed to get checkout page:', error);
        // Handle error
      })
    } catch (error) {           
    }
  }

  const checkOut =async (req,res)=>{
    console.log('chkkk checkOUt')
    console.log(req.body['paymentMethod'] ,'1111chk codddddd')
    try {
      const user=req.session.user1
      
      let products=await cartHelpers.getCartProductList(user._id)     
      let totalPrice= await cartHelpers.getTotal(user._id)
      let amountPaid=req.body.total
      console.log(typeof amountPaid,'chkkkkkkkkkk type')
      let deliveryAddress= await profileHelper.fetchPrimaryAddress(req.session.user1._id,req.body.addressId)
      await orderHelper.placeOrder(deliveryAddress,req.body,products,totalPrice,user._id,user.Name,amountPaid).then(async(orderId)=>{
    
        if(req.body['paymentMethod'] === 'COD'){
          console.log('chk cod')
          res.json({checkoutcomplete:true})        
        }     
       else{
        // console.log(orderId,'chkkk orderId')
       await orderHelper.generateRazorpay(orderId,req.body.total).then((response)=>{
        console.log(response,'chkkkkkk checkOut');
        res.json({response})
       })
       }
    
      })
    } catch (error) {
      console.log(error);
    }
    }

    const getAllOrders=async (req,res)=>{
      try {
        
        console.log("here in a-c getallorders");
      const orders=  await orderHelper.allOrders()
      console.log(orders,'chkkkkk ordersssss')
        res.render('./admin/adminPanel-orders',{orders})
      } catch (error) {    
        console.log(error);
      }
    }

    const getOrderDetails= async(req,res)=>{
      const  cartCount= await countHelper.cartCount(req.session.user1._id) 
      const  whishlistCount = await countHelper.wishlistCount(req.session.user1._id)  
      console.log('chkkkkkkk  getOrderDetails')
      const orderId = req.query.OrderId
      const order = await orderHelper.getOrderDetails(orderId)
      // console.log(req.query,"in ac getorderdetails");
      console.log(order,"in ac getorderdetails");
      res.render('./admin/admin-orderdetails',{order,cartCount,whishlistCount})
    
    }

    const updateDeliveryStatus=async(req,res)=>{
      console.log("chkkk status details")
      try {
        console.log(req.body,"in a-c updatedeliverystat");
        // const status = req.query.status
        // const orderId =req.query.orderId
        await  orderHelper.updateProductDeliveryStatus(req.body)
       await  orderHelper.updateDeliveryStatus(req.body).then((response)=>{
        
        res.json(response)
      })
      } catch (error) {
        console.log(error);
    
      }
    }
    
    const verifyPayment = (req,res)=>{
      console.log(req.body,'chkkk verifyyyyyyyyyyyyyyyy')
      orderHelper.verifyPayment(req.body).then(async()=>{
        console.log(req.body.order.response.receipt,'chkkk receipt');
       await orderHelper.changePaymentStatus(req.body.order.response.receipt).then(()=>{
          res.json({status:true})
        })  
      }).catch((error)=>{
        console.log(error)
        res.json({status:'Payment failed'})
      })     
  }

  const cancelOrder =async(req,res)=>{

    console.log('chkkkkkkk ctrrrrrrr')
    try {
     
      // console.log(req.query.id,"here in o-c cancelorder");
      await orderHelper.cancelOrder(req.params.id)
      const order =await orderHelper.getOrder(req.params.id)
      console.log(order,"cancel orderrr")
      if(order.paymentMethod==="ONLINE"){
        console.log(order.status,"chkkkkkkkkk order.status")
        if(order.status!=='pending'){
          // console.log(order.status,"chkkkkkkkkk order.status")
          const total =order.totalAmount
          await walletHelper.updateWalletAmount(total,req.session.user1._id)
    
          console.log(total,"cancel order o-c");
        }
     
      }

      res.json({response:true})
    } catch (error) {
      console.log(error);
    }
  }

  const cancelSingleProduct =async(req,res)=>{

    console.log(req.body.proId,'chkkkkkkk ctrrrrrrr pro')
    console.log(req.body.orderId,'chkkkkkkk ctrrrrrrr order')
    let prototal=  parseInt(req.body.proTotal);
    let total= parseInt(req.body.total)
    console.log(typeof prototal,prototal,'chkkkk prototal')
    console.log(typeof total,total,'chkkkk total')
    let changeTotal=total-prototal
    console.log(changeTotal,'chkkkkkk changeTotal')
    try {
      
      await orderHelper.cancelProduct(req.body.proId,req.body.orderId)
      await orderHelper.changeTotal(req.body.orderId,changeTotal)   
      await orderHelper.changeTotalPaid(req.body.orderId,changeTotal)
      const order =await orderHelper.getOrder(req.body.orderId)
      console.log(order,"cancel orderrr")
      if(order.paymentMethod==="ONLINE"){
        console.log(order.status,"chkkkkkkkkk order.status")
        if(order.status!=='pending'){
          // console.log(order.status,"chkkkkkkkkk order.status")
          // const total =order.totalAmount  
          await walletHelper.updateWalletAmount(prototal,req.session.user1._id)
          console.log(total,"cancel order o-c");
        }
     
      }
      

      res.json({response:true})
    } catch (error) {
      console.log(error);
    }
  }

  const getDashboard =async (req,res)=>{
    try {
      
      const ordersData= await dashboardHelper.getOrdertotal()
      const orders =ordersData[0]
       const categorySales =await dashboardHelper.categorySales()
       const salesData = await dashboardHelper.salesData()
        const salesCount = await dashboardHelper.salesCount()
       const categoryCount  = await categoyHelpers.categoryCount()
       const productsCount  = await dashboardHelper.productsCount()
       const onlinePay = await dashboardHelper.getOnlineCount()
       const codPay = await dashboardHelper.getCodCount()
       const latestorders = await dashboardHelper.latestorders()
       console.log(orders,categorySales,salesData,salesCount,categoryCount,productsCount,onlinePay,codPay,latestorders,"orders total")
       console.log(ordersData,"get dashBorde rsData")
       console.log(orders,"get dashBordorders")
       console.log(categorySales,"get dashBorders categorySales")
       console.log(salesData,"get dashBorders  salesData")
       console.log(salesCount,"get dashBordersData salesCount")
       console.log(categoryCount ,"get dashBorders categoryCount ")
       console.log(productsCount,"get dashBorders productsCount")
       console.log(onlinePay,"get dashBord onlinePay")
       console.log(codPay,"get dashBord codPay")
       console.log(latestorders,"get dashBord latestorders")
      
       res.render('./admin/dashboard',{orders,productsCount,categoryCount,
            onlinePay:onlinePay[0],salesData,order:latestorders,salesCount,
            codPay:codPay[0],categorySales})
      
    }
     catch (error) {
      console.log(error)
    }
    
    // res.render('./admin/dashboard')
    }

  module.exports={
    placeOrder,
    checkOut,
    getAllOrders,
    getOrderDetails,
    updateDeliveryStatus,
    verifyPayment,
    cancelOrder,
    getDashboard,
    checkStock,
    cancelSingleProduct
  }           