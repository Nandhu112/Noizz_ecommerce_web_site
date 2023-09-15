const connectDB = require("../config/connections");
const Product = require('../models/product');
const  Category = require('../models/category');



const getAllCategory=(()=>{

    return new Promise ((resolve,reject)=>{
        connectDB().then(()=>{
         Category.find({ Listed: true })
         
         .then((category)=>{
            resolve(category);
         })
         .catch((error)=>{

            reject(error)
         })
          
        })
    })
})

const getAllUnlistCategory=(()=>{

    return new Promise ((resolve,reject)=>{
        connectDB().then(()=>{
         Category.find({ Listed: false })
         
         .then((category)=>{
            resolve(category);
         })
         .catch((error)=>{

            reject(error)
         })
          
        })
    })
})


const addCategory=(cName)=>{

return new Promise((resolve,reject)=>{
    connectDB().then(()=>{
        Category.create(cName)
        .then(()=>{
            resolve();
        })
        .catch((error)=>{

            reject(error)
        })
    })
    
})    
}

const getCategory= (cName) => {

    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: cName })
          .then((cProducts) => {
            resolve(cProducts);
          })
          .catch((error) => {
      
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

          resolve()
        })
        .catch((error)=>{
    
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
     
                resolve(updatedList);
              } else {
  
                resolve(null);
              }
            })
            .catch((error) => {
        
        
              reject(error);
            });
        })
        .catch((error) => {
     
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
             
                resolve(updatedList);
              } else {
               
                resolve(null);
              }
            })
            .catch((error) => {
          
          
              reject(error);
            });
        })
        .catch((error) => {
  
          reject(error);
        });
    });
  }
  const getFilterCategory = (proCat, sortcount, priceRnge, search) => {
    let minPrice = priceRnge.min;
    let maxPrice = priceRnge.max;
    let sort;
    if (sortcount) {
      sort = sortcount;
    } else {
      sort = 1;
    }
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          const filter = {
            Category: { $in: proCat },
            Price: { $gte: minPrice, $lte: maxPrice },
          };
  
          if (search) {
            filter.$or = [
              { Name: { $regex: search, $options: 'i' } }, // Case-insensitive Name search
              { Description: { $regex: search, $options: 'i' } }, // Case-insensitive Description search
            ];
          }
  
          Product.find(filter)
            .sort({ Price: sort })
            .then((products) => {
         
              resolve(products);
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };
  
  

const getAllFilterProducts = (sort, priceRange, search) => {
  let minPrice = priceRange.min;
  let maxPrice = priceRange.max;

  return new Promise((resolve, reject) => {
    connectDB()
      .then(() => {
     
        let searchFilter = {};
        if (search) {
          searchFilter = {
            $or: [
              { Name: { $regex: search, $options: 'i' } } // Case-insensitive title search
   
            ],
          };
        }

        Product.find({
          Deleted: false,
          Price: { $gte: minPrice, $lte: maxPrice },
          ...searchFilter, // Include the search filter in the query
        })
          .sort({ Price: sort })
          .then((products) => {
            resolve(products);
          })
          .catch((error) => {
          
            reject(error);
          });
      })
      .catch((error) => {
      
        reject(error);
      });
  });
}; 

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