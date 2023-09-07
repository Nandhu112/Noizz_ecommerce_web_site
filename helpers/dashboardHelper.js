const Order=require('../models/order')
const connectDB = require("../config/connections");
const Product = require('../models/product');

const getOrdertotal = async () => {
  console.log('getOrdertotal at hpr')
    try {
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(()=>{
                Order.aggregate([
                   
                    {
                      $match: {
                        "status": "delivered"  // Consider only completed orders
                      }
                    },
                    {
                      $group: {
                        _id: null,
                        totalPriceSum: { $sum:  "$totalAmount" },
                        count: { $sum: 1 }
                      }
                    }
              
                  ]).then((data)=>{
                    resolve(data)
                  })
            })
        })
    } catch (error) {
       console.log(error) 
    }
}

const categorySales = async () => {
    try {
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(()=>{
                Order.aggregate([
                    {
                      $unwind: "$products"
                    },
                    {
                      $lookup: {
                        from: "products",
                        localField: "products.product",
                        foreignField: "_id",
                        as: "productDetails"
                      }
                    },
                    
                    {
                      $unwind: "$productDetails"
                      
                    },
                    {
                      $match: {
                        "status": "delivered"
                      }
                    },
                    {
                      $lookup: {
                        from: "categories",
                        localField: "productDetails.Category",
                        foreignField: "Category",
                        as: "categoryDetails"
                      }
                    },
                    {
                      $unwind: "$categoryDetails"
                    },
                    {
                      $project: {
                        CategoryId: "$productDetails.Category",
                        categoryName: "$categoryDetails.Category",
                        totalPrice: {
                          $multiply: [
                            { $toDouble: "$productDetails.Price" },
                            "$products.quantity"
                          ]
                        }
                      }
                    },
                    {
                      $group: {
                        _id: "$CategoryId",
                        categoryName: { $first: "$categoryName" },
                        PriceSum: { $sum: "$totalPrice" }
                      }
                    },
                    {
                      $project: {
                        categoryName: 1,
                        PriceSum: 1,
                        _id: 0
                      }
                    }
                  ])
                  .then((data)=>{
                    console.log(data,'chkkkk data')
                    resolve(data)
                  })
            })
        })
    } catch (error) {
        console.log(error)
    }
}

const salesData = async () => {
    try {
     return new Promise ((resolve,reject)=>{
         connectDB()
          .then(()=>{
             Order.aggregate([
                 {
                   $match: {
                     status: "delivered", // Match only delivered orders
                   },
                 },
                 {
                   $group: {
                     _id: {
                       $dateToString: {
                         format: "%Y-%m-%d",
                         date: "$date", // Group by the date field
                       },
                     },
                     dailySales: {
                       $sum: "$totalAmount", // Calculate the daily sales using totalAmount
                     },
                   },
                 },
                 {
                   $sort: {
                     _id: 1, // Sort the results by date in ascending order
                   },
                 },
               ])
               .then((data)=>{
                 resolve(data)
               })
          })
     })
    } catch (error) {
     console.log(error)
    } 
 }

 const salesCount = async () => {
    try {
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(()=>{
                Order.aggregate([
                    {
                      $match: {
                        "status": "delivered" // Match orders with "delivered" status
                      }
                    },
                    {
                      $group: {
                        _id: {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$date" // Group by the "date" field
                          }
                        },
                        orderCount: { $sum: 1 } // Calculate the count of orders per date
                      }
                    },
                    {
                      $sort: {
                        _id: 1 // Sort the results by date in ascending order
                      }
                    }
                  ])
                  .then ((data)=>{
                    resolve(data)
                  })
            })  
        }) 
    } catch (error) {
      console.log(error)  
    }
}

const productsCount=()=>{
    return new Promise ((resolve , reject )=>{
      connectDB()
      .then(()=>{
        Product.find({}).count().then ((data)=>{
          resolve(data)
        })
      })
    })
  }

  const getOnlineCount=()=>{
    try {
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(()=>{
                Order.aggregate([
                
                    {
                      $match: {
                        "paymentMethod": "ONLINE",
                        "status": "delivered", // Use lowercase for status based on the enum values
                      },
                    },
                    {
                      $group: {
                        _id: null,
                        totalPriceSum: { $sum: "$totalAmount" }, // Assuming totalAmount contains the price for each product
                        count: { $sum: 1 },
                      },
                    },
                  ]).then((data)=>{
                    resolve(data)
                  })
                  
            })
        })  
    } catch (error) {
       console.log(error) 
    }
}

const getCodCount=()=>{
    try {
        return new Promise ((resolve,reject)=>{
            Order.aggregate([
                
                {
                  $match: {
                    "paymentMethod": "COD",
                    "status": "delivered", // Use lowercase for status based on the enum values
                  },
                },
                {
                  $group: {
                    _id: null,
                    totalPriceSum: { $sum: "$totalAmount" }, // Assuming totalAmount contains the price for each product
                    count: { $sum: 1 },
                  },
                },
              ]).then((data)=>{
                resolve(data)
              })
        })  
    } catch (error) {
       console.log(error) 
    }
}

const latestorders =()=>{
    try {
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(()=>{
                Order.aggregate([
                    {
                      $unwind: "$products", 
                    },
                    {
                      $sort: {
                        "date": -1, 
                      },
                    },
                    {
                      $limit: 10,
                    },
                  ])
                   .then((data)=>{
                    resolve(data)
                  })
            })
        })
        
    } catch (error) {
        console.log(error)
    }
}
const totalSaleToday =()=>{

  try {
    const currentDate = new Date();
   const yesterday = currentDate;
    yesterday.setDate(yesterday.getDate()-1);
    //  yesterday.setHours(0, 0, 0, 0); 
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // console.log(today,"date")     
    return new Promise ((resolve , reject)=>{
      Order.aggregate([
        {
          $match: {
            "delivered.deliveredDate": {
              $gte: yesterday,
              $lte: new Date()
            }
          }
        }
      ]).then((data)=>{
        resolve(data)
      })
    })
  } catch (error) {
    console.log(error)
  }
}
module.exports={
    getOrdertotal,
    categorySales,
    salesData,
    salesCount,
    productsCount,
    getOnlineCount,
    getCodCount,
    latestorders,
    totalSaleToday

}