
const bannerHelper = require('../helpers/bannerHelper');
const categoyHelpers = require('../helpers/categoryHelper');

const addBannerPage = async (req,res)=>{
    const category = await categoyHelpers.getAllCategory()
    res.render('./admin/addBanner',{category})
  }

  const addBanner = async (req,res)=>{
    try { 
     
      // console.log(req.body,"kk",req.files,"file",req.files['image'],"lll")
      await bannerHelper.addBannerHelper(req.body, req.files['image']).then(( response) => {
        if (response) {
            res.redirect("/admin/addBanner");
        } else {
            res.status(505);
        }
    })
       
       
      
    } catch (error) {
      console.log(error)
    }
    }

    const bannerListPage = async (req,res)=>{
        try{
          bannerHelper.bannerListHelper().then((response)=> {
              res.render('./admin/bannerList',{banners:response})
      
          })
          
      }
      catch(error){
          console.log(error);
      }
      }

      const editBannerPage = async (req,res)=>{
        try {
         await  bannerHelper.fetchBanner(req.query.id).then (async (response)=>{
          const category = await categoyHelpers.getAllCategory()
          res.render('./admin/editBanner',{banner:response,category})
          console.log(response,category)
         })
        } catch (error) {
          console.log(error)
        }
      }

      const editBanner = async (req,res)=>{
        try {
          console.log(req.body,"body")
          await bannerHelper.editBannerHelper(req.body, req.files['image']).then(( response) => {
            if (response) {
                res.redirect("/admin/bannerList");
            } else {
                res.status(505);
            }
        })
        } catch (error) {    
          console.log(error);
        }
      }

      const deleteBanner = async (req,res)=>{
        try {
          await bannerHelper.deleteBanner(req.query.id).then((response)=>{
            if(response){
              res.redirect('/admin/bannerList')
            }
          })
        } catch (error) {
          console.console.log(error);
        }
        }
      


module.exports={
    addBannerPage,
    addBanner,
    bannerListPage,
    editBannerPage,
    editBanner,
    deleteBanner
}