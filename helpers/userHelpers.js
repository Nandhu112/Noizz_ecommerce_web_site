
const bcrypt = require("bcrypt")
const connectDB = require("../config/connections");
const User = require('../models/user');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
const Order=require('../models/order')

const addUser= async (user, callback) => {
    // console.log(user ,"jj adduser");
    const user1 = {
      Name: user.name,
      Email: user.email,
      Mobile: user.mobile,
      Password: user.password
    };
    user1.Password = await bcrypt.hash(user.password, 10);
    console.log(user1, "add chkkkkkk");
    connectDB().then(() => {
      User.create(user1)
      .then(() => {
        callback("DONE");
         })
        .catch(() => {
         callback("FAILED");
      });
    });
  }

  const getUsers = (data) => {
	console.log(data,"at the userhelpergetuser");
  return new Promise((resolve, reject) => {
    connectDB()
      .then( () => {
        User.findOne({ Email: data.Email })
          .then((user) => {
            // console.log(data,"lll");
            if (user) {

				console.log("At get users - password:",data.Password,"&&&&&","user.Password:",user.Password);
              bcrypt.compare(data.Password, user.Password)
                .then((isMatch) => {
                  if (isMatch) {
                    
                    resolve(user);
                  } else {
                    
                    resolve(null);
                  }
                })
                .catch((error) => {
                  console.log('Error comparing passwords:', error);
                  reject(error);
                });
            } else {
              
              resolve(null);
            }
          })
          .catch((error) => {
            console.log('Failed to retrieve users:', error);
            reject(error);
          });
      })
      .catch((error) => {
        // console.log('haiiiiiii1234');
        console.log('Failed to connect to the database:', error);
        reject(error);
      });
  });
};


const getAdminByMail= (email) => {
	return new Promise((resolve, reject) => {
		let Email=email.email
		let password=email.password
		console.log(Email,password,"in uh-gtadbyml");
		

	  connectDB().then(() => {
		User.findOne({Email})
		  .then((admin) => {
			console.log("user helper get adbymail",admin);
			if (admin) {
			  // Compare the entered password with the hashed password in the database
			  bcrypt.compare(password, admin.Password, (err, result) => {
				if (err) {
				  // Handle the bcrypt comparison error
				  console.log('Password comparison error:', err);
				  reject(err);
				}
				if (result) {
				  // If passwords match, resolve the promise with the admin
				  resolve(admin);
				} else {
				  // If passwords don't match, resolve the promise with null
				  resolve(null);
				}
			  });
			} else {
			  // If no admin found with the given email, resolve the promise with null
			  resolve(null);
			}
		  })
		  .catch((error) => {
			// Handle the error
			console.log('Failed to retrieve admin:', error);
			reject(error);
		  });
	  });
	});
  }	  

  const getAllUsers = () => {

    console.log("here in gaU");
    
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          User.find({})
            .then( (user) => {
        console.log(user);
          resolve(user);
              }
            )
            .catch((error) => {
              console.log('Failed to retrieve users:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  };

  const getUserById = (_id) => {
		return new Promise((resolve, reject) => {
		  connectDB().then(() => {
			console.log(_id);
			User.findById(_id) 
			  .then((user) => {
				if (user) {
				  // If user found, resolve the promise with the user
				  resolve(user);
				} else {
				  // If no user found with the given ID, resolve the promise with null
				  resolve(null);
				}
			  })
			  .catch((error) => {
				// Handle the error
				console.log('Failed to retrieve user:', error);
				reject(error);
			  });
		  });
		});
	  }

    const deleteUserById = (_id) => {
      return new Promise((resolve, reject) => {
        connectDB().then(() => {
        User.findByIdAndDelete(_id)
          .then((deletedUser) => {
          if (deletedUser) {
            // If user deleted successfully, resolve the promise with the deleted user
            resolve(deletedUser);
          } else {
            // If no user found with the given ID, resolve the promise with null
            resolve(null);
          }
          })
          .catch((error) => {
          // Handle the error
          console.log('Failed to delete user:', error);
          reject(error);
          });
        });
      });
      }

     const updateUserBlockedStatus= (userId) => {
        return new Promise((resolve, reject) => {
          connectDB()
          .then(() => {
            User.findByIdAndUpdate(userId, { Blocked: true }, { new: true })
            .then((updatedUser) => {
              if (updatedUser) {
              // If user updated successfully, resolve the promise with the updated user
              resolve(updatedUser);
              } else {
              // If no user found with the given ID, resolve the promise with null
              resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update user:', error);
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
       const updateUserUnBlockedStatus = (userId) => {
          return new Promise((resolve, reject) => {
            connectDB()
            .then(() => {
              User.findByIdAndUpdate(userId, { Blocked: false }, { new: true })
              .then((updatedUser) => {
                if (updatedUser) {
                // If user updated successfully, resolve the promise with the updated user
                resolve(updatedUser);
                } else {
                // If no user found with the given ID, resolve the promise with null
                resolve(null);
                }
              })
              .catch((error) => {
                // Handle the error
                console.log('Failed to update user:', error);
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
 
          const  getCartProductList= async(userId)=>{
            console.log(userId);
              return new Promise ( async (resolve,reject)=>{
                connectDB()
                .then( async ()=>{
                  let cart =await Cart.findOne({user:userId}).then((data)=>{
                    console.log(data,"u-h getcartprolist");
                    resolve(data.products)
                  })	
                })
                
             
              })
            }
           

            const addAddress =async(details,userId)=>{
              console.log(details,"details",userId,"user in add address");
              const newAddress = {
                firstname: details.firstname,
                lastname: details.lastname,
                state: details.state,
                address1: details.address1,
                address2: details.address2,
                city: details.city,
                pincode: details.pincode,
                mobile: details.mobile,
                email: details.email,
                };
              //   console.log(newAddress,"addreessssss");
                try {
                 
                const user = await User.findById(userId);
          
                if (!user) {
                  console.log('User not found.');
                  
                  }
          
                //   console.log( user.Address.primary,"user");
          
                  if(!user.Address.primary){
                  return new Promise((resolve,reject)=>{
                    connectDB()
                    .then(()=>{
                      // User.updateOne({ _id: userId }, { $push: { Address: newAddress } })
                      User.updateOne({ _id: userId }, { Address: { ...newAddress, primary: true }})
                      // User.findOne({_id:userId})
                      .then((data)=>{
                        console.log(data,"in db chkkkkkkkkkkk");
                        resolve(data)
                      }).catch((error)=>{ 
                        console.log(error);
                        reject(error)
                      })
                    })
                  })
                  }
                
                
                
                } catch (error) {
                console.log(error);
                }
              
            }

          const  placeOrder = async (details,products,total,user_Id)=>{
            console.log('chkkk  plceOrder');
              return new Promise ((resolve,reject)=>{
                console.log(details,products,total);
                let status=details['paymentMethod']==='COD'?'placed':'pending'
          
                const productsWithQuantity = products.map(product => {
                  return {
                    product: product.item,
                    quantity: product.quantity,
                  };
                  });
          
                let orderObj={
                  deliveryDetails : {
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
                    userId:user_Id,
                    paymentMethod:details['paymentMethod'],
                    products:productsWithQuantity,
                    totalAmount:total,
                    status:status,
                    date:new Date()
                }
               connectDB()
                .then(()=>{
                  Order.create(orderObj)
                  .then(async (response)=>{
                    const deleteResult = await Cart.deleteOne({ user: user_Id })
                    console.log(user_Id,"userid",deleteResult,"find");
                    resolve()
                  }).catch((error)=>{
                    console.log(error);
                    reject(error)
                  })
                })
              })
            }
                

            const getUserEmail = (email) => {
              return new Promise((resolve, reject) => {
                connectDB().then(() => {
                
                User.findOne({Email:email}) 
                  .then((user) => {
                  if (user) {
                    // If user found, resolve the promise with the user
                    console.log('found userrr')
                    resolve(user);
                  } else {
                    // If no user found with the given ID, resolve the promise with null
                    resolve(null);
                  }
                  })
                  .catch((error) => {
                  // Handle the error
                  console.log('Failed to retrieve user:', error);
                  reject(error);
                  });
                });
              });
              }
        
  module.exports={
    addUser,
    getUsers,
    getAdminByMail,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserBlockedStatus,
    updateUserUnBlockedStatus,
    getCartProductList,
    addAddress,
    placeOrder,
    getUserEmail
  }
