
const couponHelper = require("../helpers/couponHelper")
const cartHelpers = require("../helpers/cartHelper")

const getCouponManager = async (req, res) => {
  res.redirect('/admin/listCoupons')
}

const addcouponPage = async (req, res) => {
  res.render('./admin/admin-addCoupon')
}

const addcoupons = async (req, res) => {
  const data = {
    couponCode: req.body.coupon,
    validity: req.body.validity,
    minPurchase: req.body.minAmount,
    minDiscountPercentage: req.body.discountPercentage,
    maxDiscountValue: req.body.maxDiscount,
    description: req.body.description
  }
  await couponHelper.addcoupons(data)
    .then((response) => {
      res.json(response)
    })
}

const listCoupons = async (req, res) => {
  try {
    const coupons = await couponHelper.getCouponList()
    res.render('./admin/admin-couponList', { coupons })
  } catch (error) {

    res.render("error-404");
  }
}

const deleteCoupon = async (req, res) => {
  try {
    const id = req.query.couponId
    await couponHelper.deleteCoupon(id).then((response) => {
      res.json(response)
    })


  } catch (error) {

    res.render("error-404");
  }
}

const applyCoupon = async (req, res) => {
  const couponCode = req.query.coupon
  const total = req.query.total
  const userId = req.session.user1._id

  couponHelper.applyCoupon(couponCode, total)
    .then((response) => {
      res.send(response)
    })
}

const verifyCoupon = async (req, res) => {
  const couponCode = req.params.id.toUpperCase()
  const userId = req.session.user1._id
  couponHelper.verifyCoupon(userId, couponCode)
    .then((response) => {
      res.send(response)
    })
}
module.exports = {
  getCouponManager,
  addcouponPage,
  addcoupons,
  listCoupons,
  deleteCoupon,
  applyCoupon,
  verifyCoupon
}