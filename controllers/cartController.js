const cartHelpers = require("../helpers/cartHelper")
const productHelper = require('../helpers/productHelper');
const countHelper = require("../helpers/countHelper")


const addToCart = async (req, res) => {
  await cartHelpers.addToCart(req.params.id, req.session.user1._id).then((response) => {

    res.json({ response: true })
  })
}

const getCart = async (req, res) => {

  try {
    const cartCount = await countHelper.cartCount(req.session.user1._id)
    const userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
    if (cartCount == 0) {
      const data = {
        userWishlistCount: userWishlistCount,
        cartCount: cartCount
      };
      res.render('./user/cart', data);
    }
    else {
      let products = await cartHelpers.getCartProducts(req.session.user1._id)
      let total = await cartHelpers.getTotal(req.session.user1._id)
      const data = {
        products: products,
        total: total,
        userWishlistCount: userWishlistCount,
        cartCount: cartCount
      };
      res.render('./user/cart', data);
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const changeQuantity = async (req, res) => {
  try {
    const product = await productHelper.getProductById(req.body.product)
    const proStock = product.Stock
    await cartHelpers.changeProductQuantity(req.body, proStock).then((response) => {

      res.json(response)
    })
  }
  catch (error) {

    res.render("error-404");
  }
}

const removeCartProduct = async (req, res, next) => {
  try {
    await cartHelpers.removeCartProduct(req.body).then((response) => {
      res.json(response)
    })
  }
  catch (error) {

    res.render("error-404");
  }
}


module.exports = {
  addToCart,
  getCart,
  changeQuantity,
  removeCartProduct,

}