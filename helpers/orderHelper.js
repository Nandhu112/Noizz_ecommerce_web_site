
const User = require('../models/user');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Order=require('../models/order')
const connectDB = require("../config/connections");
const Razorpay = require('razorpay');
const SECRET = process.env.RAZPAY_SECRET;
const dotenv = require('dotenv').config();
const { orderSuccess } = require('../controllers/userController');

const instance = new Razorpay({
    key_id: 'rzp_test_m6zZEYiHS8zKwF',
    key_secret: SECRET,
  });

const getAddress= async (userId) => {  
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                User.findById(userId).then((data) => { 
                    const address=data.Address
                    resolve(address)
                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
            })
    })        
}
const placeOrder= async (details,data, products, total, user_Id, userName,amountPaid) => {
    console.log('chkkk checkOUt444444444')
    return new Promise(async (resolve, reject) => {
        // console.log(details, products, total);
        let status = data['paymentMethod'] === 'COD' ? 'placed' : 'pending'

        const productsWithQuantity = products.map(product => {
            return {
                product: product.item,
                quantity: product.quantity,
                price:product.price
            };   
        });

        let orderObj = {
            deliveryDetails: {
                firstname: details.firstname,
                lastname: details.lastname,
                state: details.state,
                address1: details.address1,
                address2: details.address2,
                city: details.city,
                pincode: details.pincode,
                mobile: details.mobile,
                email: details.email,
            },
            userName: userName,
            userId: user_Id,
            paymentMethod:data['paymentMethod'],
            products: productsWithQuantity,
            totalAmount: total,
            amountPaid:amountPaid,
            status: status,
            date: new Date()
        }

        connectDB()
            .then(async () => {
                let cartId
                await Order.create(orderObj)
                    .then(async (response) => {
                        cartId = response._id
                        const deleteResult = await Cart.deleteOne({ user: user_Id })

                        resolve(cartId)
                    }).then(async (response) => {
                        // console.log("+++++++++", cartId, "u-hhhhh");

                        const Products = await Order
                            .findOne({ _id: cartId })
                            .populate("products.product");

                        // console.log("+++++++++", Products, "u-hhhhh");

                        Products.products.map(async (item) => {
                            // console.log(item, "item");
                            let stock = item.product.Stock - item.quantity;
                            console.log(item.product.Stock, "prostock", item.quantity, "quantity", stock, "stock");

                            await Product.findByIdAndUpdate(     
                                item.product._id,
                                {
                                    Stock: stock,
                                },
                                { new: true }
                            );
                        });

                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
            })
    })
}

const allOrders= async () => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                Order.find({}).sort({ date: -1 }).then((data) => {
                    resolve(data)
                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
            })
    })
}

const getOrderDetails= async (orderId) => {
console.log('chkkkk getOrderDetails hlprrrrrrrr')
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                Order.findById(orderId)
                    .populate('products.product') // Populate the 'product' field within the 'products' array
                    .populate('userId')
                    .exec()
                    .then((data) => {
                        resolve(data)
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
            })
    })
}

const getOrderCount =(userId)=>{
 console.log(userId,'chkkkk user iddddd')
 return new Promise ((resolve,reject)=>{
    connectDB().then(()=>{
        Order.find({userId:userId}).then((orders)=>{
            const orderCount=orders.length
            console.log(orderCount,'chkkkkkkk iddddddddddddddddddddddd')
            resolve(orderCount)
                
            }).catch((error)=>{
                console.log(error)
                reject(error)
            })
          
        })
    })

 }

 const getOrders = async (userId,page) => {
    
    return new Promise((resolve, reject) => {
        console.log("in u-h getOrders");
        connectDB()
            .then(async () => {
                const orders = await Order.find({ userId: userId }).sort({ date: -1 }) 
             
                    // Order.findById(orderId)
                    .populate('products.product') // Populate the 'product' field within the 'products' array
                    .exec()
                    .then((data) => {
                        console.log(data, "in u-h getorders");
                        resolve(data)
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
            })
    })
}

const updateDeliveryStatus= async (details) => {
    console.log(details,"chkkk status details")
    const status =details.status;
    console.log(status,"chkkk status")
    const orderId=details.orderId.trim()
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {    
                Order.findByIdAndUpdate(orderId, { status: status }).then(() => {
                    resolve({updated:true})
                }).catch((error) => {
                    reject(error)
                })   
            })
    })

}
const updateProductDeliveryStatus= async (details) => {
    console.log(details,"chkkk status details")
    const status =details.status;
    console.log(status,"chkkk status")
    const orderId=details.orderId.trim()
    return new Promise((resolve, reject) => {
        connectDB()
            .then(async () => {
                const updatedOrder = await Order.findByIdAndUpdate(
                    orderId,
                    {
                        $set: {
                            'products.$[elem].proStatus': status
                        }
                    },
                    {
                        new: true,
                        arrayFilters: [{ 'elem.proStatus': { $ne: 'cancelled' } }]
                    }
                ).exec();
    
                resolve(updatedOrder);
            })
            .catch(reject);
    });    
    }    


const generateRazorpay = ((orderId,total)=>{
    return new Promise ((resolve,reject)=>{   
        instance.orders.create({
          amount: total*100,
          currency: "INR",
          receipt: ""+orderId,
          notes: {
            key1: "value3",
            key2: "value2"
          }
        }).then((order)=>{
            console.log(order)
            resolve(order)
        }).catch((error)=>{
            console.log(error)
            reject(error)
        })
    })

})



 const verifyPayment =async(details)=>{
    console.log(details,'chkkkkkkk details');
    console.log("veri pay o-h ");
    return new Promise (async (resolve,reject)=>{
        const secret =SECRET
        const crypto =require('crypto')
        let hmac = await crypto.createHmac('sha256', secret)
        // console.log(details.payment.razorpay_payment_id,"heeerrreee");
        hmac.update(details.payment.razorpay_order_id+'|'+details.payment.razorpay_payment_id)
       hmac= hmac.digest('hex')
       console.log(hmac,'chkkkkkkk hmac');
        if(hmac==details.payment.razorpay_signature){
            console.log("veri pay o-h resolved");
            resolve()
        }else{
            console.log("veri pay o-h rejected");
            reject()
        }
    })                     
}

const changePaymentStatus = ((orderId)=>{
    console.log('test changePaymentStatus');
    return new Promise ((resolve,reject)=>{
        connectDB().then(()=>{
            Order.findByIdAndUpdate(orderId, {status:'placed'})          
            .then(()=>{
                console.log('status changed');
                resolve()
            }).catch((error)=>{
                reject(error)
            })
        })
    })
})

const cancelOrder =async (orderId) => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                Order.findByIdAndUpdate(orderId, { $set: { status: 'cancelled' } }).then(() => {
                    resolve()
                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
            })
    })
}
const cancelProduct = async (productId, orderId) => {
    console.log(productId, orderId, 'chkkkkkkkkkkk idsss');
    return new Promise((resolve, reject) => {
        connectDB()
            .then(async () => {
                const updatedOrder = await Order.findOne({ _id: orderId });

                // Find the product within the order's products array
                const productIndex = updatedOrder.products.findIndex(
                    (product) => product.product.toString() === productId
                );

                if (productIndex !== -1) {
                    // Set the proStatus to 'cancelled'
                    updatedOrder.products[productIndex].proStatus = 'cancelled';

                    // Save the updated order
                    await updatedOrder.save();

                    resolve();
                } else {
                    reject(new Error('Product not found in the order'));
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
};

const changeTotal = (orderId, newTotal) => {
    console.log(orderId, newTotal, 'chkkk change total');

    return new Promise(async (resolve, reject) => {
        try {
            const updatedOrder = await Order.findOneAndUpdate(
                { _id: orderId },
                { $set: { amountPaid: newTotal } },
                { new: true } 
            );

            if (!updatedOrder) {
                throw new Error("Order not found");
            }

            resolve(updatedOrder);
        } catch (error) {
            reject(error);
        }
    });
};
const changeTotalPaid = (orderId, newTotal) => {
    console.log(orderId, newTotal, 'chkkk change total');

    return new Promise(async (resolve, reject) => {
        try {
            const updatedOrder = await Order.findOneAndUpdate(
                { _id: orderId },
                { $set: { totalAmount: newTotal } },
                { new: true } 
            );

            if (!updatedOrder) {
                throw new Error("Order not found");
            }

            resolve(updatedOrder);
        } catch (error) {
            reject(error);
        }
    });
};

 

const getOrder=async (orderId)=>{
    return new Promise ((resolve ,reject)=>{
        connectDB()
        .then(()=>{
            Order.findById(orderId)
            .then((order)=>{
                resolve (order)
            }).catch((err)=>{
                reject(err)
            })
        })
    })
}

const findOrdersDelivered =()=>{
    try {
      return new Promise ((resolve,reject)=>{
        connectDB()
        .then(()=>{
          Order.find({status:"delivered"}).then((data)=>{
            resolve(data)
          })
        })
      })
    } catch (error) {
      console.log(error)
    }
  }
 const  findOrdersDelivered_populated= ()=>{
    try {
      return new Promise ((resolve,reject)=>{
        connectDB().then(()=>{
          Order.find({status:"delivered"})
          .populate({ path: "userId", model: "users" })
          // .populate({ path: "address", model: "addres" })
          .populate({ path: "products.product", model: "Product" })
      .exec().then((data)=>{
        resolve(data)
        console.log(data,"data")
      })
        })
      })
     
    } catch (error) {
      console.log(error)
    }
  }

  const findOrderByDate=(startDate,endDate)=>{
    try {
      return new Promise ((resolve ,reject)=>{
        connectDB()
        .then(()=>{
          Order.find({
            // status: "Delivered",
            date: {
              $gte: startDate, 
              $lte: endDate,
            },
          })
            .populate({ path: "userId", model: "users" })
            // .populate({ path: "address", model: "addres" })
            .populate({ path: "products.product", model: "Product" })
            .exec().then((data)=>{
              resolve(data)
            })
        })
      })
    } catch (error) {
      console.log(error)
    }
      }

      const invoiceGetOrder=async (orderId)=>{
        return new Promise ((resolve ,reject)=>{
            connectDB()
            .then(()=>{
                Order.findById(orderId)
                .populate('products.product')
                .then((order)=>{
                    resolve (order)
                }).catch((err)=>{
                    reject(err)
                })
            })
        })
    }





module.exports={
    getAddress,
    placeOrder,
    allOrders,   
    getOrderDetails,
    getOrderCount,
    getOrders,
    updateDeliveryStatus,
    generateRazorpay,
    verifyPayment,
    changePaymentStatus,
    cancelOrder,
    getOrder,
    findOrdersDelivered,
    findOrdersDelivered_populated,
    findOrderByDate,
    invoiceGetOrder,
    updateProductDeliveryStatus,
    cancelProduct,
    changeTotal,
    changeTotalPaid
    
}