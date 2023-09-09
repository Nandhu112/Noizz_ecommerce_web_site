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


adminRouter.get('/',adminController.getAdminLogin)           
adminRouter.get('/admin-login',adminController.login)   
adminRouter.post('/admin-login',adminController.verifyAdmin)
adminRouter.get('/logout',adminController.logOut)
adminRouter.get('/add-product',productController. adminAddProductPage)      
adminRouter.post('/add-product',adminController.adminAddProduct)
adminRouter.get('/admineditproduct',adminController.adminGetProduct)      
adminRouter.get('/allUsers',adminController.getAllUsers )
adminRouter.get('/admindeleteuser',adminController.adminDeleteUser)
adminRouter.get('/adminedituser',adminController.adminGetUser)            
adminRouter.get('/adminAllproducts',adminController.getAdminLogin)
adminRouter.get('/admindeleteproduct',adminController.adminDeleteProduct)
adminRouter.get('/adminblock_user',adminController.adminBlockUser)
adminRouter.get('/adminUn_block_user',adminController.adminUnBlockUser)
adminRouter.post('/edit-product/:id',adminController.adminEditProduct)   


adminRouter.get('/addCategory',categoryController.addCategory)
adminRouter.post('/addCategory',categoryController.InsertCategory)
adminRouter.get('/getAllCategory',categoryController.getAllCategory)
adminRouter.get('/editCategoryPage',categoryController.editCategoryPage)
adminRouter.post('/editCategory',categoryController.editCategory)
adminRouter.get('/categoryUnlist',categoryController.categoryUnlist)
adminRouter.get('/Unlisted-Category',categoryController.UnlistedCategory)
adminRouter.get('/categoryRelist',categoryController.categoryRelist)
adminRouter.get('/getCategoryProduct',categoryController.getCategoryProduct)

adminRouter.get('/allOrders',orderController.getAllOrders )
adminRouter.get('/adminViewOrderDetails',orderController.getOrderDetails )
adminRouter.post('/updateDeliveryStatus',orderController.updateDeliveryStatus)

adminRouter.get('/getCouponPage',couponController.getCouponManager)
adminRouter.get('/addCoupon',couponController.addcouponPage)
adminRouter.post('/addCoupon',couponController.addcoupons)
adminRouter.get('/listCoupons',couponController.listCoupons)
adminRouter.get('/removeCoupon',couponController.deleteCoupon)


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