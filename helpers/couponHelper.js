const Coupon = require("../models/coupon")
const connectDB = require("../config/connections");
const mongoose = require('mongoose');
const User = require('../models/user');


const addcoupons= async(data)=>{
    return new Promise ((resolve ,reject )=>{
        connectDB()
        .then(async()=>{
            try {
               
                    Coupon.findOne({ couponCode: data.couponCode })
                        .then((coupon) => {
                            if (coupon) {
                            resolve({status: false})
                            } else {
                                new Coupon(data).save()
                                    .then((response) => {
                                    resolve({status:true})
                                })
                            }
                        })
               
                
            
              } catch (error) {
             
              }
        })
    })
}

const getCouponList =async ()=>{
    return new Promise ((resolve,reject)=>{
        connectDB()
        .then(async()=>{
            await Coupon.find({}).then((data)=>{
                resolve(data)
            })
        })
    })
}
const deleteCoupon = async (id)=>{
    return new Promise ((resolve,reject)=>{
        connectDB()
        .then(async ()=>{
            await Coupon.deleteOne({ _id: id })

           .then(()=>{
                resolve({status: true})
            }).catch((error)=>{
          
            })
        })
    })
}

const applyCoupon =async  (couponCode, total) => {
    try {
        return new Promise((resolve, reject) => {
        Coupon.findOne({ couponCode: couponCode }).then(
          (couponExist) => {
            if (couponExist) {
              if (new Date(couponExist.validity) - new Date() > 0) {
                if (total >= couponExist.minPurchase) {
                  let discountAmount =
                    (total * couponExist.minDiscountPercentage) / 100;
                  if (discountAmount > couponExist.maxDiscountValue) {
                    discountAmount = couponExist.maxDiscountValue;
                    resolve({
                      status: true,
                      discountAmount: discountAmount,
                      discount: couponExist.minDiscountPercentage,
                      couponCode: couponCode,
                    });
                  } else {
                    resolve({
                      status: true,
                      discountAmount: discountAmount,
                      discount: couponExist.minDiscountPercentage,
                      couponCode: couponCode,
                    });
                  }
                } else {
                  resolve({
                    status: false,
                    message: `Minimum purchase amount is ${couponExist.minPurchase}`,
                  });
                }
              } else {
                resolve({
                  status: false,
                  message: "Coupon expired",
                });
              }
            } else {
              resolve({
                status: false,
                message: "Coupon doesn't Exist",
              });
            }
          }
        );
      })
    } catch (error) {
     
    }
  }

  const verifyCoupon = async (userId, couponCode)=>{
    try {
        return new Promise(async(resolve, reject) => {
          const couponExist = await Coupon.findOne({ couponCode: couponCode })
           
            if (couponExist) {
          
              if (new Date(couponExist.validity) - new Date() > 0) {
                const usersCoupon = await User.findOne({
                  _id: userId,
                  coupons: { $in: [couponCode] },
                });
               

                if (usersCoupon) {
                  resolve({
                    status: false,
                    message: "Coupon already used by the user",
                  });
                } else {
                  resolve({
                    status: true,
                    message: "Coupon added successfully",
                  });
                }
              } else {
                resolve({ status: false, message: "Coupon have expired" });
              }
            } else {
              resolve({ status: false, message: "Coupon doesn't exist" });
            } 
      });
    } catch (error) {
     
      reject(error)
    }
}

module.exports={
    addcoupons,
    getCouponList,
    deleteCoupon,
    applyCoupon,
    verifyCoupon
 
    
}