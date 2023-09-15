const orderHelper = require('../helpers/orderHelper')
const cartHelpers = require("../helpers/cartHelper")
const walletHelper = require("../helpers/walletHelper")
const profileHelper = require('../helpers/profileHelper')
const dashboardHelper = require('../helpers/dashboardHelper')
const categoyHelpers = require('../helpers/categoryHelper');
const productHelper = require('../helpers/productHelper');
const countHelper = require("../helpers/countHelper")
const couponHelper = require("../helpers/couponHelper")


const checkStock = async (req, res) => {
  productHelper.checkStock(req.session.user1._id).then((response) => {
    res.json(response)
  })
}

const placeOrder = async (req, res) => {
  try {
    const promises = [
      cartHelpers.getTotal(req.session.user1._id),
      cartHelpers.getSubTotal(req.session.user1._id),
      orderHelper.getAddress(req.session.user1._id),
      cartHelpers.getCartProducts(req.session.user1._id),
      walletHelper.getWallet(req.session.user1._id),
      couponHelper.getCouponList()
    ];

    Promise.all(promises)
      .then(([total, subTotal, address, cartItems, wallet, data]) => {
        if (address.length) {
          let chk = 1

          res.render('./user/checkoutPage', { total, subTotal, address, cartItems, wallet, data, chk })
        }
        else {
          let chk = 0

          res.render('./user/checkoutPage', { Noaddress: true, address: 0, total, subTotal, cartItems, wallet, data, chk })
        }


      })
      .catch((error) => {

        res.render("error-404");

      })
  } catch (error) {
    res.render("error-404");
  }
}

const checkOut = async (req, res) => {
  try {
    const user = req.session.user1
    let products = await cartHelpers.getCartProductList(user._id)
    let totalPrice = await cartHelpers.getTotal(user._id)
    let amountPaid = req.body.total
    let deliveryAddress = await profileHelper.fetchPrimaryAddress(req.session.user1._id, req.body.addressId)
    await orderHelper.placeOrder(deliveryAddress, req.body, products, totalPrice, user._id, user.Name, amountPaid).then(async (orderId) => {
      if (req.body['paymentMethod'] === 'COD') {
        res.json({ checkoutcomplete: true })
      }
      else {
        await orderHelper.generateRazorpay(orderId, req.body.total).then((response) => {
          res.json({ response })
        })
      }

    })
  } catch (error) {

    res.render("error-404");
  }
}

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderHelper.allOrders()
    res.render('./admin/adminPanel-orders', { orders })
  } catch (error) {

    res.render("error-404");
  }
}

const getOrderDetails = async (req, res) => {
  const orderId = req.query.OrderId
  const order = await orderHelper.getOrderDetails(orderId)
  res.render('./admin/admin-orderdetails', { order })
}

const updateDeliveryStatus = async (req, res) => {
  try {
    await orderHelper.updateProductDeliveryStatus(req.body)
    await orderHelper.updateDeliveryStatus(req.body).then((response) => {

      res.json(response)
    })
  } catch (error) {

    res.render("error-404");

  }
}

const verifyPayment = (req, res) => {
  orderHelper.verifyPayment(req.body).then(async () => {
    await orderHelper.changePaymentStatus(req.body.order.response.receipt).then(() => {
      res.json({ status: true })
    })
  }).catch((error) => {

    res.json({ status: 'Payment failed' })
  })
}

const cancelOrder = async (req, res) => {
  try {
    await orderHelper.cancelOrder(req.params.id)
    const order = await orderHelper.getOrder(req.params.id)
    if (order.paymentMethod === "ONLINE") {
      if (order.status !== 'pending') {
        const total = order.totalAmount
        await walletHelper.updateWalletAmount(total, req.session.user1._id)
      }

    }
    res.json({ response: true })
  } catch (error) {

    res.render("error-404");
  }
}

const cancelSingleProduct = async (req, res) => {
  let prototal = parseInt(req.body.proTotal);
  let total = parseInt(req.body.total)
  let changeTotal = total - prototal
  try {
    await orderHelper.cancelProduct(req.body.proId, req.body.orderId)
    await orderHelper.changeTotal(req.body.orderId, changeTotal)
    await orderHelper.changeTotalPaid(req.body.orderId, changeTotal)
    const order = await orderHelper.getOrder(req.body.orderId)
    if (order.paymentMethod === "ONLINE") {
      if (order.status !== 'pending') {
        await walletHelper.updateWalletAmount(prototal, req.session.user1._id)
      }
    }
    res.json({ response: true })
  } catch (error) {

    res.render("error-404");
  }
}

const getDashboard = async (req, res) => {
  try {

    const ordersData = await dashboardHelper.getOrdertotal()
    const orders = ordersData[0]
    const categorySales = await dashboardHelper.categorySales()
    const salesData = await dashboardHelper.salesData()
    const salesCount = await dashboardHelper.salesCount()
    const categoryCount = await categoyHelpers.categoryCount()
    const productsCount = await dashboardHelper.productsCount()
    const onlinePay = await dashboardHelper.getOnlineCount()
    const codPay = await dashboardHelper.getCodCount()
    const latestorders = await dashboardHelper.latestorders()
    res.render('./admin/dashboard', {
      orders, productsCount, categoryCount,
      onlinePay: onlinePay[0], salesData, order: latestorders, salesCount,
      codPay: codPay[0], categorySales
    })

  }
  catch (error) {

    res.render("error-404");
  }

}

module.exports = {
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