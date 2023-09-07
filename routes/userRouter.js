const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController.js');
const cartController = require('../controllers/cartController.js');
const orderController = require('../controllers/orderController.js');
const productController = require('../controllers/productController');
const profileController = require('../controllers/profileController');
const wishlistController = require('../controllers/wishlistController');
const VerificationController = require('../controllers/VerificationController');
const couponController = require('../controllers/couponController.js');
const auth = require('../middleware/auth')

userRouter.get('/', userController.landingPage)
// router.post('/verify',userController.verify)
userRouter.get('/usersignup', userController.usersignup)
userRouter.post('/verify', userController.verify)
userRouter.get('/verifyOtp', userController.verifyOtpPage)
userRouter.post('/verifyOtp', userController.verifyOtp)
userRouter.get('/signup', userController.signup)
userRouter.post('/signup', userController.userSignup)
userRouter.get('/login', auth.isLogin, userController.login)
userRouter.post('/login', userController.getuserlogin)
userRouter.get('/home', auth.isLogout, auth.isBlocked, userController.home)
userRouter.get('/logout', auth.isLogout, userController.logout)

    
userRouter.get('/forgotPassword', VerificationController.forgotPassword)   
userRouter.get('/reset-password/:token', VerificationController.resetPassword)
// userRouter.get('/reset-password',VerificationController.resetPassword)
userRouter.post('/reset-password', VerificationController.resetUserPassword)              

userRouter.get('/allProducts', auth.isLogout, auth.isBlocked, productController.allProducts)
userRouter.post('/filterProduct', auth.isLogout, auth.isBlocked, productController.filterProducts)
userRouter.get('/filterProduct', auth.isLogout, auth.isBlocked, productController.filterProducts)


    

userRouter.get('/getCategoryProduct', auth.isLogout, auth.isBlocked, productController.userGetCategoryProduct)
userRouter.get('/productdetails', auth.isLogout, auth.isBlocked, productController.getProductDetails)
userRouter.get('/search', productController.searchProduct)
userRouter.get('/addToCart/:id', auth.isLogout, auth.isBlocked, cartController.addToCart)
userRouter.get('/carts', auth.isLogout, cartController.getCart);
userRouter.post('/changeProductQuantity', auth.isLogout, cartController.changeQuantity)
userRouter.post('/removeCartProduct', auth.isLogout, cartController.removeCartProduct)

userRouter.get('/addToWishlist/:id', auth.isLogout, auth.isBlocked, wishlistController.addToWishlist)
userRouter.get('/wishlist', auth.isLogout, auth.isBlocked, wishlistController.getWishlist)
userRouter.post('/removewishlistProduct', auth.isLogout, wishlistController.removewishlistProduct)
userRouter.get('/checkStock',auth.isLogout, auth.isBlocked, orderController.checkStock)
userRouter.get('/placeorder', auth.isLogout, auth.isBlocked, orderController.placeOrder)
// userRouter.post('/applyCoupon',couponController.applyCoupon)
userRouter.get('/verifyCoupon/:id',couponController.verifyCoupon)
userRouter.get('/applyCoupon',couponController.applyCoupon)


userRouter.get('/cancelOrder/:id', auth.isLogout, orderController.cancelOrder)   
userRouter.post('/cancelSingleProduct', auth.isLogout, orderController.cancelSingleProduct)    

// userRouter.get('/placeorder',auth.isLogout,orderController.placeOrder)
// userRouter.post('/checkout',auth.isLogout,userController.checkOut)  
userRouter.get('/orderSuccess', auth.isLogout, auth.isBlocked, userController.orderSuccess)    

userRouter.get('/getProfilePage', auth.isLogout, auth.isBlocked, profileController.getProfilePage)
userRouter.get('/manageAddress', auth.isLogout, auth.isBlocked, profileController.manageAddress)
userRouter.get('/addAddress', auth.isLogout, auth.isBlocked, profileController.addAddress)
userRouter.post('/addNewAddress', auth.isLogout, auth.isBlocked, profileController.addNewAddress)
userRouter.get('/editAddress', auth.isLogout, auth.isBlocked, profileController.editAddress)
userRouter.post('/editAddress', auth.isLogout, auth.isBlocked, profileController.updateAddress)
userRouter.get('/deleteAddress', auth.isLogout, auth.isBlocked, profileController.deleteAddress)
userRouter.get('/getaUserProfile', auth.isLogout, auth.isBlocked, profileController.getaUserProfile)
userRouter.get('/getaOrderDetails', auth.isLogout, auth.isBlocked, profileController.orderPage)

userRouter.post('/changePrimaryAddress', auth.isLogout, auth.isBlocked, profileController.changePrimaryAddress)
userRouter.post('/checkout', auth.isLogout, auth.isBlocked, orderController.checkOut)
userRouter.post('/verifyPayment', orderController.verifyPayment)
userRouter.get('/invoice',profileController.getOrderInvoice)
 



module.exports = userRouter;