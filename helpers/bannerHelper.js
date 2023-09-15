const connectDB = require("../config/connections");
const mongoose = require('mongoose');
const Banner = require('../models/banner');


const addBannerHelper=async(texts, Image) => {
    return new Promise(async (resolve, reject) => {
      
        const imageName= Date.now() +Image.name
        connectDB().then (async ()=>{
            const banner = new Banner({
                title: texts.title,
                link: texts.link,
                image: imageName ,
            });
            await banner.save().then((response) => {
           
                if ( Image) {
                  
                  const images = Image;
               
                 
                  const movePromises = [];
              
                  
                    const image = images;
                    const movePromise = new Promise((resolve, reject) => {
                      image.mv('./public/bannerImage/'+imageName, (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      });
                    });
                    movePromises.push(movePromise);

                  Promise.all(movePromises)
                    .then(() => {
            
                    })
                    .catch((error) => {
              
                    });
                } else {

                }
                resolve(response);
            });
        })
       
    });
}

const bannerListHelper =async ()=>{
    return new Promise ((resolve ,reject)=>{
        connectDB()
        .then(()=>{
            Banner.find().then((response) => {
                resolve(response);
            });
        })
    })
}

const fetchBanner = async (id)=>{
    return new Promise ((resolve,reject)=>{
        connectDB()
        .then(()=>{
      
            Banner.findById(id).then((response) => {
                resolve(response);
            });  
        })
    })
}

const editBannerHelper = async (details,Image)=>{
  return new Promise(async (resolve, reject) => {
   
      const imageName= details.img
      connectDB().then (async ()=>{
          Banner.findByIdAndUpdate(details.id,{$set:{
              title:details.title,
              image:imageName,
              link: details.link
          }})
         .then((response) => {
           
              if ( Image) {
                
                const images = Image;
           
          
                const movePromises = [];
            
                
                  const image = images;
                  const movePromise = new Promise((resolve, reject) => {
                    image.mv('./public/banner-images/'+imageName, (err) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve();
                      }
                    });
                  });
                  movePromises.push(movePromise);
                
                Promise.all(movePromises)
                  .then(() => {
             
                  })
                  .catch((error) => {
                    console.log('Failed to move images:', error);

                  });
              } else {

              }
              resolve(response);
          });
      })
     
  });
}

const deleteBanner = async (id)=>{
  return new Promise ((resolve,reject)=>{
      console.log(id,"id in delete banner");
      connectDB()
      .then(()=>{
        Banner.findByIdAndDelete(id).then ((response)=>{
              resolve(response)
          })
      })
  })
}


module.exports={
    addBannerHelper,
    bannerListHelper,
    fetchBanner,
    editBannerHelper,
    deleteBanner

}