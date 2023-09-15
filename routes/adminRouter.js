const express = require('express');
const adminRouter= express.Router();
const adminController = require('../controllers/adminController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController.js');
const couponController = require('../controllers/couponController.js');
const adminReportController = require('../controllers/adminReportController');
const bannerController = require('../controllers/bannerController');
const adminAuth=require ('../middleware/adminAuth')


adminRouter.get('/',adminAuth.isLogin,adminController.getAdminLogin)           
adminRouter.get('/admin-login',adminController.login)   
adminRouter.post('/admin-login',adminController.verifyAdmin)
adminRouter.get('/logout',adminController.logOut)
adminRouter.get('/add-product',adminAuth.isLogin,productController. adminAddProductPage)      
adminRouter.post('/add-product',adminAuth.isLogin,adminController.adminAddProduct)
adminRouter.get('/admineditproduct',adminAuth.isLogin,adminController.adminGetProduct)      
adminRouter.get('/allUsers',adminAuth.isLogin,adminController.getAllUsers )
adminRouter.get('/admindeleteuser',adminAuth.isLogin,adminController.adminDeleteUser)
adminRouter.get('/adminedituser',adminAuth.isLogin,adminController.adminGetUser)            
adminRouter.get('/adminAllproducts',adminAuth.isLogin,adminController.getAdminLogin)
adminRouter.get('/admindeleteproduct',adminAuth.isLogin,adminController.adminDeleteProduct)
adminRouter.get('/adminblock_user',adminAuth.isLogin,adminController.adminBlockUser)
adminRouter.get('/adminUn_block_user',adminAuth.isLogin,adminController.adminUnBlockUser)
adminRouter.post('/edit-product/:id',adminAuth.isLogin,adminController.adminEditProduct)   


adminRouter.get('/addCategory',adminAuth.isLogin,categoryController.addCategory)
adminRouter.post('/addCategory',adminAuth.isLogin,categoryController.InsertCategory)
adminRouter.get('/getAllCategory',adminAuth.isLogin,categoryController.getAllCategory)
adminRouter.get('/editCategoryPage',adminAuth.isLogin,categoryController.editCategoryPage)
adminRouter.post('/editCategory',adminAuth.isLogin,categoryController.editCategory)
adminRouter.get('/categoryUnlist',adminAuth.isLogin,categoryController.categoryUnlist)
adminRouter.get('/Unlisted-Category',adminAuth.isLogin,categoryController.UnlistedCategory)
adminRouter.get('/categoryRelist',adminAuth.isLogin,categoryController.categoryRelist)
adminRouter.get('/getCategoryProduct',adminAuth.isLogin,categoryController.getCategoryProduct)

adminRouter.get('/allOrders',adminAuth.isLogin,orderController.getAllOrders )
adminRouter.get('/adminViewOrderDetails',adminAuth.isLogin,orderController.getOrderDetails )
adminRouter.post('/updateDeliveryStatus',adminAuth.isLogin,orderController.updateDeliveryStatus)

adminRouter.get('/getCouponPage',adminAuth.isLogin,couponController.getCouponManager)
adminRouter.get('/addCoupon',adminAuth.isLogin,couponController.addcouponPage)
adminRouter.post('/addCoupon',adminAuth.isLogin,couponController.addcoupons)
adminRouter.get('/listCoupons',adminAuth.isLogin,couponController.listCoupons)
adminRouter.get('/removeCoupon',adminAuth.isLogin,couponController.deleteCoupon)


adminRouter.get('/dashboard',adminAuth.isLogin,orderController.getDashboard)

adminRouter.get('/totalSaleExcel',adminAuth.isLogin,adminReportController.totalSaleExcel)
adminRouter.get('/todayRevenueExcel',adminAuth.isLogin,adminReportController.totalRevenueExcel)
adminRouter.get('/allProductExcel',adminAuth.isLogin,adminReportController.productListExcel)
adminRouter.get('/allOrderStatusExcel',adminAuth.isLogin,adminReportController.allOrderStatus)
adminRouter.get('/orderDetailPDF',adminAuth.isLogin,adminReportController.orderDetailPDF)
adminRouter.get('/customDate',adminAuth.isLogin,adminReportController.customPDF)

adminRouter.get('/addBanner',adminAuth.isLogin,bannerController.addBannerPage)
adminRouter.post('/addBanner',adminAuth.isLogin,bannerController.addBanner)
adminRouter.get('/bannerList',adminAuth.isLogin,bannerController.bannerListPage)
adminRouter.get('/editBanner',adminAuth.isLogin,bannerController.editBannerPage)
adminRouter.post('/editBanner',adminAuth.isLogin,bannerController.editBanner) 
adminRouter.get('/deleteBanner',adminAuth.isLogin,bannerController.deleteBanner)


module.exports = adminRouter;