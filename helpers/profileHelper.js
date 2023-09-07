const User = require('../models/user');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
const Order=require('../models/order')
const bcrypt = require("bcrypt")
const connectDB = require("../config/connections");


const getProfile= async (userId) => {
    return new Promise((resolve, reject) => {
        connectDB()
            .then(() => {
                User.findById(userId).then((data) => {
                    resolve(data)
                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
            })
    })
}

const addAddress = async (details, userId) => {
    console.log(details, "details", userId, "user in add address");
    const newAddress = {
        _id: new mongoose.Types.ObjectId(),
        firstname: details.fname,
        lastname: details.lname,
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

        // if (!user.Address.primary) {
            if (user) {
            return new Promise((resolve, reject) => {
                connectDB()
                    .then(() => {
                        User.updateOne({ _id: userId }, { $push: { Address: newAddress } })
                            .then((data) => {
                                console.log(data,"addaddress u-c");
                                resolve(true)
                            }).catch((error) => {
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

const fetchAddress= async (userId,addressId) =>{
    return new Promise ((resolve,reject)=>{
        connectDB()
        .then(()=>{
            User.findById(userId)
            .then((user)=>{
                const addressIndex = user.Address.findIndex(addr => String(addr._id) === addressId);
                
                console.log(user,"data in fetch address ",addressIndex,"add index");
                if (addressIndex !== -1) {
                const address= user.Address[addressIndex]
                // console.log(address,"address here");
                    resolve(address)
                }else{
                    reject()
                }
            
            }) 	
        })
    })
}

const updateAddress=async (userId,addressId,updatedAddress)=>{
    try {
        return new Promise (async (resolve,reject)=>{
        const user = await User.findById(userId);
        const addressIndex = user.Address.findIndex(addr => String(addr._id) === addressId);
    
        if (addressIndex !== -1) {
          Object.assign(user.Address[addressIndex], updatedAddress);
          await user.save().then (()=>{
            resolve(true)
          })
        } else {
          console.log("Address not found!");
          reject()
        }
        })
        
      } catch (error) {
        console.error("Error updating address:", error);
      }
}

const deleteAddress= async (userId, addressId) => {
    try {

        console.log(userId, addressId," u-h deleteaddress herre");
      return new Promise(async (resolve, reject) => {
        // Find the user by its ObjectId
        const user = await User.findByIdAndUpdate(userId, { $pull: { Address: { _id: addressId} } })
        .then(()=>{
            resolve(true)
        }).catch((error)=>{
            console.log(error);   
        reject(error)
        })
        
      });
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  }

  const changePrimaryAddress= async(userId,addressId)=>{
    try {
        const user = await User.findById(userId);
    
        if (!user) {
          console.error('User not found.');
          return;
        }
    
        // Update all addresses and set 'primary' to false
        user.Address.forEach(address => {
          if (address._id.toString() !== addressId) {
            address.primary = false;
          } else {
            address.primary = true;
          }
        });
    
        // Save the updated user document
        const updatedUser = await user.save();
        console.log('User updated successfully:', updatedUser);
      } catch (err) {
        console.error('Error updating user:', err);
      }
}

const fetchPrimaryAddress = async (userId)=>{
    return new Promise ((resolve, reject)=>{
        connectDB()
        .then(()=>{
            User.findById(userId)
            .then((data)=>{
                const primaryAddress = data.Address.find((address) => address.primary);

                if (primaryAddress) {
                  resolve(primaryAddress) ; // Return the primary address object
                } else {
                  throw new Error('Primary address not found.');
                }
            })
        })
    })
}

const updatePassword=async (userPassword,email)=>{
  console.log(email,'chkkkemail')
  const hashedPassword = await bcrypt.hash(userPassword, 10);

  return new Promise ((resolve,reject)=>{
    User.findOne({ Email: email })
  .then(async (user) => {
    if (user) {
      user.Password = hashedPassword;
      await user.save(); 
      console.log('Password updated successfully');
      resolve(true)
    } else {
      console.log('User not found');
      reject(false)
    }
  })
  .catch((error) => {
    console.error('Error updating password:', error);
  });
  })
}

module.exports={
    getProfile,
    addAddress,
    fetchAddress,
    updateAddress,
    deleteAddress,
    changePrimaryAddress,
    fetchPrimaryAddress,
    updatePassword
    
}