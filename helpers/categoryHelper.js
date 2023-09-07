const connectDB = require("../config/connections");
const Product = require('../models/product');
const  Category = require('../models/category');



const getAllCategory=(()=>{
    console.log('chkkkkk all cat')
    return new Promise ((resolve,reject)=>{
        connectDB().then(()=>{
         Category.find({ Listed: true })
         
         .then((category)=>{
            resolve(category);
         })
         .catch((error)=>{
            console.log('failed to get cartss')
            reject(error)
         })
          
        })
    })
})

const getAllUnlistCategory=(()=>{
    console.log('chkkkkk all cat')
    return new Promise ((resolve,reject)=>{
        connectDB().then(()=>{
         Category.find({ Listed: false })
         
         .then((category)=>{
            resolve(category);
         })
         .catch((error)=>{
            console.log('failed to get cartss')
            reject(error)
         })
          
        })
    })
})


const addCategory=(cName)=>{
console.log('chkkkkk cate')
return new Promise((resolve,reject)=>{
    connectDB().then(()=>{
        Category.create(cName)
        .then(()=>{
            resolve();
        })
        .catch((error)=>{
            console.log('failed to add cart')
            reject(error)
        })
    })
    
})    
}

const getCategory= (cName) => {
  console.log('hoiiiiiiiiiii');
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: cName })
          .then((cProducts) => {
            resolve(cProducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  }

  const changeCategoryName=(prevName,newName)=>{
    return new Promise((resolve,reject)=>{
      connectDB().
      then(()=>{
        Category.updateOne({Category:prevName},{$set:{Category:newName}})
        .then(()=>{
          console.log("category edit succeeded");
          resolve()
        })
        .catch((error)=>{
          console.log("category edit failed:",error);
          reject(error)
        })
      })
    })
  }
 const getcategoryById= (_id)=> {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
      Category.findById(_id)
        .then((category) => {
          if (category) {
            resolve(category);
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to retrieve category:', error);
          reject(error);
        });
      });
    });
  }

 

 const categoryUnlist = (catId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Category.findByIdAndUpdate(catId, { Listed:false }, { new: true })
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

  const categoryRelist= (catId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Category.findByIdAndUpdate(catId, { Listed:true }, { new: true })
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
const getFilterCategory=((proCat,sortcount,priceRnge)=>{
  console.log(priceRnge,'chk range at hpr')
  let minPrice = priceRnge.min
  let maxPrice = priceRnge.max

  console.log(minPrice,'chkkkkkkkk min')
  console.log(maxPrice,'chk maxxxxxxxx')
  let sort
  if(sortcount){
    sort=sortcount
  }
  else{
     sort=1
  }
  console.log(proCat,'chkkkkkkkkkkkk prooooooooooo')
  return new Promise ((resolve,reject)=>{
     connectDB().then(()=>{
      Product.find({ Category: { $in: proCat},Price: { $gte: minPrice, $lte: maxPrice } })
  .sort({ Price: sort }) // Sort by Price in ascending order
  .then(products => {
    console.log(products);
    resolve(products)
  })
  .catch(error => {
    console.error(error);
    reject(error)
  });
     })
  })
})

const getAllFilterProducts = (sort,priceRnge) => {
  let minPrice = priceRnge.min
  let maxPrice = priceRnge.max
  return new Promise ((resolve,reject)=>{
    connectDB().then(() => {
      Product.find({ Deleted: false, Price: { $gte: minPrice, $lte: maxPrice } })
      .sort({ Price: sort })
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

const categoryCount =async ()=>{
  return new Promise ((resolve ,reject)=>{
      connectDB()
      .then(()=>{
          Category.find({Listed:true}).count().then((data)=>{
              resolve(data)
          })
      })
  })
}


module.exports={
    getAllCategory,
    addCategory,
    getCategory,
    changeCategoryName,
    getcategoryById,
    categoryUnlist,
    categoryRelist,
    getAllUnlistCategory,
    getFilterCategory,
    getAllFilterProducts,
    categoryCount
}