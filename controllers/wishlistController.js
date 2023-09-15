const wishlistHelpers = require("../helpers/wishlistHelper")
const countHelper = require("../helpers/countHelper")

const addToWishlist = async (req, res) => {
  const productId = req.params.id;
  wishlistHelpers.addToWishlist(req.params.id, req.session.user1._id).then((result) => {
    res.json({ response: true })
  })

}

const getWishlist = async (req, res) => {

  try {
    const cartCount = await countHelper.cartCount(req.session.user1._id)
    const userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
    if (userWishlistCount < 1) {
      res.render('./user/wishlist', { noproducts: true, cartCount, userWishlistCount });
    }
    else {
      let products = await wishlistHelpers.getwishlistProducts(req.session.user1._id).then((products) => {
        res.render('./user/wishlist', { products, cartCount, userWishlistCount });
      })
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const removewishlistProduct = async (req, res, next) => {
  try {
    const user = req.session.user1
    await wishlistHelpers.removeWishlistProduct(req.body, user).then((response) => {

      res.json(response)
    })
  }
  catch (error) {

    res.render("error-404");
  }
}


module.exports = {
  addToWishlist,
  getWishlist,
  removewishlistProduct,

}