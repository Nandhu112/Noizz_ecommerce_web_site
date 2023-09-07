
const productHelper = require('../helpers/productHelper');
const categoyHelpers = require('../helpers/categoryHelper');
// const Cart = require('../models/cart');


const getAllCategory = async (req, res) => {
    try {
     const category=await categoyHelpers.getAllCategory()
      res.render('./admin/adminPanel-category',{category})
    }catch (error) {
      console.log(error.message);
    }
  }

  const addCategory = async (req, res) => {
    try {
      res.render('./admin/adminaddCategory')
    }catch (error) {
      console.log(error.message);
    }
  }

  const InsertCategory= async (req, res) => {
    try {
      console.log(req.body.cName,"// here insertcategory");
        try {
          let category={ Category: req.body.cName }
             await categoyHelpers.addCategory(category).then(()=>{
              // res.render('./admin/add-product');
              res.redirect('/admin/add-product')
            })
            // console.log(eproducts,"here");
           
          } catch (error) {
            console.log('Failed to add Category:', error);
            res.status(500).send('Internal Server Error');
          }
    }
    catch (error) {
        console.log(error.message);
      }
  }

  const getCategoryProduct = async (req, res) => {
    try {
      
              
        cName=req.query.category
      const promises = [
        categoyHelpers.getCategory(cName),
        categoyHelpers.getAllCategory()
      ];
      
        // Wait for all promises to resolve
        Promise.all(promises)
          .then(([cProducts,category]) => {
            // console.log(EarRingsProduct);
            // res.render('home', {cProducts,category });
            res.render('./admin/adminAllproductsList', { products:cProducts,category});
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
            // Handle error
          });
    
      
  
    }
    catch (error) {
      console.log(error.message);
    }
  }
  
  const editCategoryPage=async (req,res)=>{
    try {
      let categoryId=req.query.categoryId
      let category=req.query.categoryName
      // console.log(category,"catt");
      res.render('./admin/admin-editcategory',{category})
    } catch (error) {
      
    }
  
  }
  const editCategory=async (req,res)=>{
    try {
      let prevName=req.body.cName
      let newName=req.body.newcName
      await categoyHelpers.changeCategoryName(prevName,newName)
      await productHelper.changeProductCategoryName(prevName,newName)
      res.redirect('/admin/getAllCategory');
    } catch (error) {
      
    }
  }

  const categoryUnlist=async (req,res)=>{
    try {
      
  console.log("a_c cat unlist");
  
      try {
        const categoryId = req.query.categoryId;
        const categoryName= req.query.categoryName
       const category= await categoyHelpers.getcategoryById({ _id: categoryId });
        await productHelper.deleteCategoryProducts({Category:categoryName})
        if (!category) {
          console.log(category,"no category");
          return res.redirect('/admin/getAllCategory');
        }
    
        await categoyHelpers.categoryUnlist(categoryId);

        res.redirect('/admin/getAllCategory');
      } catch (err) {
        console.log(err);

        res.redirect('/admin');
      }

    } catch (error) {
      console.log(error);
    }
  }

  const categoryRelist=async (req,res)=>{
    try {
      
  console.log("a_c cat relist");
  
      try {
        const categoryId = req.query.categoryId;
        const categoryName= req.query.categoryName
        const category = await categoyHelpers.getcategoryById({ _id: categoryId });
        await productHelper.UndeleteCategoryProducts({Category:categoryName})
        
        if (!category) {
          console.log(category,"no category");
          return res.redirect('/admin/getAllCategory');
        }
       let reListed= await categoyHelpers.categoryRelist(categoryId);
       
       console.log(reListed,"relisted logged");
        res.redirect('/admin/getAllCategory');
      } catch (err) {
        console.log(err);

        res.redirect('/admin');
      }
 
    } catch (error) {
      console.log(error);
    }
  }

  const UnlistedCategory = async (req, res) => {
    try {
     const category=await categoyHelpers.getAllUnlistCategory()
      res.render('./admin/adminPanel-category',{category})
    }catch (error) {
      console.log(error.message);
    }
  }


  
module.exports={
    getAllCategory,
    addCategory,
    InsertCategory,
    getCategoryProduct,
    editCategoryPage,
    editCategory,
    categoryUnlist,
    categoryRelist,
    UnlistedCategory,
}