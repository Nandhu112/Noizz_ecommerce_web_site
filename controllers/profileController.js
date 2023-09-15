
const userHelpers = require("../helpers/userHelpers")
const productHelper = require('../helpers/productHelper');
const profileHelper = require('../helpers/profileHelper');
const orderHelper = require('../helpers/orderHelper');
const wishlistHelpers = require("../helpers/wishlistHelper")
const countHelper = require("../helpers/countHelper")
const Cart = require('../models/cart');
const Order = require('../models/order')
const Wishlist = require('../models/wishlist');
const easyinvoice = require("easyinvoice");
const fs = require("fs");
const { Readable } = require('stream');



const getProfilePage = async (req, res) => {
  try {
    const user = await req.session.user1
    const cartCount = await countHelper.cartCount(req.session.user1._id)
    const userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
    const orders = await orderHelper.getOrderCount(user._id)
    res.render('./user/userProfilePage', { cartCount, user, orders, userWishlistCount });
  }
  catch (error) {

    res.render("error-404");
  }
}

const manageAddress = async (req, res) => {
  try {
    const profile = await profileHelper.getProfile(req.session.user1._id)
    const address = profile.Address
    if (!profile.Address.length == 0) {
      res.render('./user/manageAddress', { address, profile, condition: true })
    }
    else {
      res.render('./user/manageAddress', { address, condition: false })
    }

  } catch (error) {

    res.render("error-404");
  }
}
const addAddress = async (req, res) => {
  res.render('./user/addnewAddress')
}

const addNewAddress = async (req, res) => {
  const userId = req.session.user1._id
  const data = req.body
  const status = await profileHelper.addAddress(data, userId)
  if (status) {
    res.redirect('/manageAddress')
  } else {
    res.redirect('/home')
  }
}

const editAddress = async (req, res) => {
  const addressId = req.query.id
  const userId = req.session.user1._id
  const address = await profileHelper.fetchAddress(userId, addressId)
  res.render('./user/editAddress', { address })
}

const updateAddress = async (req, res) => {
  const addressId = req.body.id
  const userId = req.session.user1._id
  const updatedAddress = {

    firstname: req.body.fname,
    lastname: req.body.lname,
    state: req.body.state,
    address1: req.body.address1,
    address2: req.body.address2,
    city: req.body.city,
    pincode: req.body.pincode,
    mobile: req.body.mobile,
    email: req.body.email,

  }

  const updated = await profileHelper.updateAddress(userId, addressId, updatedAddress)
  if (updated) {
    res.redirect('/manageAddress')
  }
}

const deleteAddress = async (req, res) => {
  const userId = req.session.user1._id
  const addressId = req.query.id
  const firstName = req.query.fname
  const lastName = req.query.lname
  const status = await profileHelper.deleteAddress(userId, addressId, firstName, lastName)
  if (status) {
    res.redirect('/manageAddress')
  } else {
    res.redirect('/home')
  }

}
const getaUserProfile = async (req, res) => {
  try {
    const user = await req.session.user1
    const userCart = await Cart.findOne({ user: req.session.user1._id });
    if (userCart) {
      const cartCount = await userHelpers.getCartCount(req.session.user1._id)
      res.render('./user/userProfile', { cartCount, user });
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const changePrimaryAddress = async (req, res) => {
  await profileHelper.changePrimaryAddress(req.session.user1._id, req.body.addressId)

}

const orderPage = async (req, res) => {
  try {
    let orders = await orderHelper.getOrders(req.session.user1._id)
    if (orders < 1) {
      res.render('./user/userOrderPage', { noorders: true })
    }

    res.render('./user/userOrderPage', { orders })
  } catch (error) {

    res.render("error-404");
  }
}

const getOrderInvoice = async (req, res) => {
  try {
    const id = req.query.id
    userId = req.session.user._id;

    result = await orderHelper.invoiceGetOrder(id);
    const date = result.date.toLocaleDateString();
    const product = result.products;
    const order = {
      id: id,
      total: parseInt(result.totalAmount),
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
      "quantity": parseInt(product.quantity),
      "description": product.product.Name,
      "tax-rate": 0,
      "price": parseInt(product.price),
    }));
    var data = {
      customize: {},
      images: {
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
        country: "India",
      },
      information: {
        number: order.id,
        date: order.date,
        "due-date": "Nil",
      },
      products: products,
      "bottom-notice": "Thank you,Keep shopping.",
    };
    result = Object.values(result)


    easyinvoice.createInvoice(data, async (result) => {
      if (result && result.pdf) {
        await fs.writeFileSync("invoice.pdf", result.pdf, "base64");
        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        const pdfStream = new Readable();
        pdfStream.push(Buffer.from(result.pdf, 'base64'));
        pdfStream.push(null);
        pdfStream.pipe(res);
      } else {
        res.status(500).send("Error generating the invoice");
      }


    }).catch((err) => {

      res.render("error-404");
    })


  } catch (error) {

    res.render("error-404");
  }
}


module.exports = {
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