const productHelper = require('../helpers/productHelper');
const categoyHelpers = require('../helpers/categoryHelper');
const countHelper = require("../helpers/countHelper")



const adminAddProductPage=async (req,res)=>{   

    try {
        try{
             
            const promises = [
             
              categoyHelpers.getAllCategory()  
            ];
          
            // Wait for all promises to resolve
            Promise.all(promises)
              .then(([category]) => {
                console.log([ category],'chkk pro and cat');
                res.render('./admin/add-product', { category });
              })
              .catch((error) => {
                console.log('Failed to retrieve products:', error);
                // Handle error
              });
        
          
        }
          catch (err) {
            console.log(err);
            console.log("error occured !!!!!here @get home");
            res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
  }

  const allProducts=async (req,res)=>{

    try {
      let num=[1]
        try{
            const promises = [
              productHelper.getAllProducts(),
              categoyHelpers.getAllCategory()
          
            ];
          
            // Wait for all promises to resolve
            Promise.all(promises)
              .then(async([products, category]) => {
                console.log([products, category],'chkk pro and cat');
                const  userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
                const  cartCount= await countHelper.cartCount(req.session.user1._id)
                const itemsPerPage = 6;
                const currentPage = parseInt(req.query.page) || 1;
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedProducts = products.slice(startIndex, endIndex);
                const totalPages = Math.ceil(products.length / itemsPerPage);
                const pages = [];
             
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
                res.render('./user/allproducts', {home:true,products:paginatedProducts,category ,userWishlistCount,cartCount,num,currentPage,totalPages,pages});
              })
              .catch((error) => {
                console.log('Failed to retrieve products:', error);
                // Handle error
              });
                 
        }
          catch (err) {
            console.log(err);
            console.log("error occured !!!!!here @get home");
            res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
  }

  const userGetCategoryProduct = async (req, res) => {
    try {
      
              
        cName=req.query.category
      const promises = [
        categoyHelpers.getCategory(cName),
        categoyHelpers.getAllCategory()
      ];

        Promise.all(promises)
          .then(([cProducts,category]) => {

            res.render('./user/allproducts', { products:cProducts,category});
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
          });

  
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const getProductDetails=async (req,res)=>{
    const  cartCount= await countHelper.cartCount(req.session.user1._id) 
    const  userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)  
  
    try {
      let id=req.query.id
      const product = await productHelper.getProductById({ _id: id });
      if (!product) {
        return res.redirect('/login');
      }else{
        const context = {
          items: [0, 1]
        };
        res.render('./user/productDetailsPage',{product,context,cartCount,userWishlistCount});   
      }
  // res.redirect('/productdetails')
      // return res.render('h');
    } catch (err) {
      console.log(err);
      res.redirect('/home'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  

  const  searchProduct= async (req, res) => {
    try {
        
          const query = req.query.name
          const products = await productHelper.searchProducts(query)
          if (products) {
            // console.log('hiiiiiiiiiiiiii contro  '+products);
            // res.setHeader("Cache-Control", "no-cache, no-store")
            res.render("./user/allproducts", {products })
          } else res.send("Error geting user data")
        }
            
    catch (error) {
        console.log(error.message);
      }
    }

    const filterProducts=(async(req,res)=>{
      const proCat = req.body.proCat
      const sortcount=req.body.sort
      const priceRange=req.body.range
      let min
      let max
      if(!priceRange){
        console.log('nopriceee')
        min=0
        max=500000
      }
      else{
        const isOneInArray = priceRange.includes('1');
        const isTwoInArray = priceRange.includes('2');   
        const isThreeInArray = priceRange.includes('3');
        console.log(priceRange,isThreeInArray,'nopriceee')
     
        if (isOneInArray) {
          min=0
        }else if(isTwoInArray){
          min=200000
        }
        else{
          min=300000
        }
  
        if(isThreeInArray){
          max=500000
        }
       else if(isTwoInArray){
        max=300000
      }
      else{
        max=100000
      }
      }
      
    console.log(min,'chkkkkkkkk min at ctr')
    console.log(max,'chkkkkkkkk max at ctr')
    let priceRanges=
     {min:min,
      max:max}
      console.log(proCat,'chkkk cat');
      console.log(sortcount,'chkkk sortcoun');
      console.log(priceRanges,'chkkk priceRangessss');
      if(proCat){   
        const  productss = await categoyHelpers.getFilterCategory(proCat,sortcount,priceRanges) 
        const itemsPerPage = 6;
                const currentPage = parseInt(req.query.page) || 1;
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedProducts = productss.slice(startIndex, endIndex);
                const totalPages = Math.ceil(productss.length / itemsPerPage);
                const pages = [];
                console.log(currentPage,'chkkkk currentPage')
                console.log(startIndex,'chkkkk startIndex')
                console.log(endIndex, 'chkkkk endIndex')
                console.log( paginatedProducts,'chkkkk paginatedProducts')
                console.log(totalPages,'chkkkk totalPages')
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }  
                let products=paginatedProducts
              
        res.json({filter:true,products,currentPage,totalPages,pages})
      }
      else {
        console.log('no products');
        const  productss = await categoyHelpers.getAllFilterProducts(sortcount,priceRanges)  
        const itemsPerPage = 6;
                const currentPage = parseInt(req.query.page) || 1;
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedProducts = productss.slice(startIndex, endIndex);
                const totalPages = Math.ceil(productss.length / itemsPerPage);
                const pages = [];
                console.log(currentPage,'chkkkk currentPage11')
                console.log(startIndex,'chkkkk startIndex11')
                console.log(endIndex, 'chkkkk endIndex11')
                console.log( paginatedProducts,'chkkkk paginatedProducts11')
                console.log(totalPages,'chkkkk totalPages11')
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
                let products=paginatedProducts
               
        res.json({filter:true,products,currentPage,totalPages,pages})
      }
      
  
    })



module.exports={
    adminAddProductPage,
    // adminGetProduct,
    allProducts,
    userGetCategoryProduct,
    getProductDetails,
    searchProduct,
    filterProducts


}