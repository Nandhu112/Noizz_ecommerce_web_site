const connectDB = require("../config/connections");
const Product = require('../models/product');
const Cart = require('../models/cart');
// const collection=require('../config/collections');


const addProduct = (product, callback) => {
    console.log(product);
    connectDB().then(() => {
      Product.create(product)
        .then((data) => {
          console.log(data,"addpro");
          callback(data._id);
        })
        .catch((error) => {
          console.log('Failed to add product:', error);
          callback(false);
        });
    });
  }

  const getAllProducts = (req,res) => {
    return new Promise ((resolve,reject)=>{
      connectDB().then(() => {
        Product.find({ Deleted: false })
        .then((products) => {
          resolve(products)
        })
        .catch((error)=>{
          console.log('failde to get pro at getAllpro')
          reject(error)
        })
      })
    })
  }

  const filteredProducts =(details) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(async () => {

          let minPrice=0 // Minimum price for the range
          let maxPrice=20000000 // Maximum price for the range
          let sort=1

          console.log(details.categoryValue,"caatval");

          if(details.sortByValue==='sortByHigh'){
            sort=-1
          }
         

          let match = {}
          if (details.categoryValue) {
            match.Category = details.categoryValue
          }else {
            match.Deleted =false
          }

          if (details.priceRangeValue) {
            const inputString = details.priceRangeValue;
            const pattern = /minPrice:(\d+),maxPrice:(\d+)/;

            const match = inputString.match(pattern);


            if (match) {
              minPrice = parseInt(match[1]);
              maxPrice = parseInt(match[2]);             
            }
          }
          await Product.aggregate([
            {
              $match: {
                Price: { $gte: minPrice, $lte: maxPrice },
                
              }
            },
            {
              $match: match
             },
            {
              $sort: { Price: sort } // Sort by price in descending order
            }
          ]).then((data) => {
            console.log(data,"data filtered")
            resolve(data)
          })

        })
    })
  }

  const getProductById = (_id)=> {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
      Product.findById(_id)
        .then((product) => {
          if (product) {
            // If product found, resolve the promise with the product
            resolve(product);
          } else {
            // If no product found with the given ID, resolve the promise with null
            resolve(null);
          }
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to retrieve product:', error);
          reject(error);
        });
      });
    });
  }

  const adminAllproducts = (callback) => {
    connectDB().then(() => {
      Product.find({ Deleted: false })
        .then((products) => {
          callback(products);
        })
        .catch((error) => {
          console.log('Failed to get products:', error);
          callback(null);
        });
    });
  }

  const getGuitars_Product = () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'Guitars',Deleted: false })
          .then((gproducts) => {
            // console.log(gproducts)
            resolve(gproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  }

  const getDrums_Product = () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'Drums',Deleted: false })
          .then((dproducts) => {
            // console.log(dproducts)
            resolve(dproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  }

  const getKeyboards_Product = () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'Keyboards',Deleted: false })
          .then((kproducts) => {
            // console.log(kproducts)
            resolve(kproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  }

  const softDeleteProduct = (proId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.findByIdAndUpdate(proId, { Deleted:true }, { new: true })
            .then((updatedProduct) => {
              if (updatedProduct) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedProduct);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  }

 const updateProduct= (proId, proDetails) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.findByIdAndUpdate(proId, proDetails, { new: true })
            .then((updatedProduct) => {
              if (updatedProduct) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedProduct);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  }

 
  const  searchProducts = async(query)=> {
    try {
      return new Promise ((resolve, reject) => {
        connectDB().then(() => {
          const regex = new RegExp('^' + query, 'i');
         const products = Product.find({ Name: regex });
    
            if (products) {
              // console.log('checkkkkkkkkkkk'+products );
              // If product found, resolve the promise with the product
              resolve(products);
            } else {
              // If no product found with the given ID, resolve the promise with null
              resolve(null);
            }
          })
          .catch((error) => {
            // Handle the error
            console.log('Failed to retrieve product:', error);
            reject(error);
          });
        });
        }
            
    catch (error) {
        console.log(error.message);
      }
    }
    const changeProductCategoryName=(prevName,newName)=>{
      return new Promise((resolve,reject)=>{
        connectDB()
        .then(()=>{
          Product.updateMany({Category:prevName},{$set:{Category:newName}})
          .then(()=>{
            console.log("product category updated");
            resolve()
          })
          .catch((error)=>{
            console.log("error in product category updation :",error);
            reject(error)
          })
        })
      })
    }
  
    const deleteCategoryProducts= (catName) => {
      return new Promise((resolve, reject) => {
        connectDB()
          .then(() => {
            Product.updateMany( catName, { $set: { Deleted:true } }
            )
              .then((updatedList) => {
                if (updatedList) {
                  // If product updated successfully, resolve the promise with the updated product
                  resolve(updatedList);
                } else {
                  // If no product found with the given ID, resolve the promise with null
                  resolve(null);
                }
              })
              .catch((error) => {
                // Handle the error
                console.log('Failed to update product:', error);
                reject(error);
              });
          })
          .catch((error) => {
            // Handle the error
            console.log('Failed to connect to the database:', error);
            reject(error);
          });
      });
    }
   
   const UndeleteCategoryProducts= (catName) => {
      return new Promise((resolve, reject) => {
        connectDB()
          .then(() => {
            Product.updateMany( catName, { $set: { Deleted:false } }
            )
              .then((updatedList) => {
                if (updatedList) {
                  // If product updated successfully, resolve the promise with the updated product
                  resolve(updatedList);
                } else {
                  // If no product found with the given ID, resolve the promise with null
                  resolve(null);
                }
              })
              .catch((error) => {
                // Handle the error
                console.log('Failed to update product:', error);
                reject(error);
              });
          })
          .catch((error) => {
            // Handle the error
            console.log('Failed to connect to the database:', error);
            reject(error);
          });
      });
    }

   const checkStock=(userId)=>{
      return new Promise ((resolve ,reject )=>{
        connectDB()
        .then(async ()=>{
          const products = await Cart.findOne({user:userId})
          const cartProducts = products.products
          for(const cartProduct of cartProducts ){
            const productId = cartProduct.item;
            const product = await Product.findOne({_id:productId})
            if(product.Stock < cartProduct.quantity ){
              resolve({status:false}) 
            }
          }
          resolve({status:true})
        }).catch((error)=>{
          console.log(error);
        })
      })
    }
    

 

  module.exports={
    addProduct,
    getAllProducts,
    getProductById,
    adminAllproducts,
    getGuitars_Product,
    getDrums_Product,
    getKeyboards_Product,
    softDeleteProduct,
    updateProduct,
    searchProducts,
    changeProductCategoryName,
    deleteCategoryProducts,
    UndeleteCategoryProducts,
    filteredProducts,
    checkStock
  }