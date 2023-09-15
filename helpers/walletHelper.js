const Order=require('../models/order')
const Wallet=require('../models/wallet')
const connectDB = require("../config/connections");

const updateWalletAmount=async (total,userId)=>{
  console.log('chkkkk wallet')
    try {
      return new Promise (async (resolve, reject)=>{
          connectDB()   
          .then (async ()=>{
           let wallet= await  Wallet.findOne({ userId: userId })
            if (!wallet) {
              wallet = new Wallet({
                  userId: userId,
                  balance: total
              });
              await wallet.save();
              console.log(" New Wallet amount added successfully.");
             resolve()
          }else{
              let  updatedAmount=wallet.balance+total
              console.log(wallet.balance,total,updatedAmount,"walleet")
             await Wallet.findOneAndUpdate({ userId: userId },
                  {
                      $set:{
                          balance:updatedAmount
                      }
                  })
          }
          console.log("Wallet amount updated successfully.");
             resolve()    
             
              
          }).catch((err)=>{
              console.log(err);
              reject(err)
          })
      })
    } catch (error) {
      console.log(error);
    }
  }

  const getWallet=async (userId)=>{
    try {
      return new Promise ((resolve,reject)=>{
        connectDB()
        .then(async ()=>{
          let wallet= await  Wallet.findOne({ userId: userId })
          if (!wallet) {
            wallet = new Wallet({
                userId: userId,
                balance: 0
            });
            await wallet.save();
        }else{
          resolve(wallet)
        }
        })
      })
    } catch (error) {
      
    }
  }



module.exports={

    updateWalletAmount,
    getWallet

}