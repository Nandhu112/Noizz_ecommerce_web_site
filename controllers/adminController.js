const productHelper = require('../helpers/productHelper');
const adminHelpers = require("../helpers/adminHelpers")
const userHelpers = require("../helpers/userHelpers")
const categoyHelpers = require('../helpers/categoryHelper');


const getAdminLogin=async (req,res)=>{

  try {
      try{
           
          const promises = [
            productHelper.getAllProducts(),
            categoyHelpers.getAllCategory()
        
          ];
        
          // Wait for all promises to resolve
          Promise.all(promises)
            .then(([products, category]) => {
              // console.log([products, category],'chkk pro and cat');
              res.render('./admin/adminAllproductsList', { products, category });
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

const login=async (req,res)=>{
  
  try{
      if(req.session.user){
          res.redirect('/admin')
        }
        else{
          console.log('chkkkkkkkk login');
          res.render('./admin/adminLogin')  

        }
        // console.log('chkkkkkkkk login');
        // res.render('./admin/adminLogin')       
        // req.session.loginErr=false
  }
  catch (error) {
      console.log(error.message);    
    }
}


const logOut = async (req, res) => {
  console.log('chkkk admin logOut')
    try {
        req.session.admin=false
        res.redirect('/admin')
    }
    catch (error) {
        console.log(error.message);
      }
}

const verifyAdmin = async (req, res) => {

    try {
        try {
            const email = req.body.email;
            const password=req.body.password
            const admin = await userHelpers.getAdminByMail({ email,password});
            console.log("here verifyadmin", admin);
            if (admin.Admin) {
              console.log('chkk adin true...........');
              req.session.admin=true
              return res.redirect('/admin');
            }
          else{
            // Render the admin profile page with the retrieved admin data
            res.render('./admin/adminLogin');
          }
          } catch (err) {
            console.log(err);
            res.redirect('/'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
}



const  adminAddProductPage= async (req, res) => {
    try {
        res.render('./admin/add-product')
    }
    catch (error) {
        console.log(error.message);
      }
}

const adminAddProduct= async (req, res) => {

    try {
        
        productHelper.addProduct(req.body, (id) => {
            console.log(req.files, "in here multer");
            if (req.files && req.files['images[]']) {
              
              const images = req.files['images[]'];
              console.log(images,"entered");
              // const destinationPath = './public/product-images/';
              const movePromises = [];
          
              for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const movePromise = new Promise((resolve, reject) => {
                  image.mv('./public/images/'+id+i+'.jpg', (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                });
                movePromises.push(movePromise);
              }
          
              // Wait for all file moves to complete
              Promise.all(movePromises)
                .then(() => {
                  // All files moved successfully
                  // Perform any other actions you need to do after file upload
          
                  // Send response or redirect
                  res.render("admin/add-product")
                })
                .catch((error) => {
                  console.log('Failed to move images:', error);
                  // Handle the error
                  res.status(500).send('Failed to add product');
                });
            } else {
              // Handle case where no images were uploaded
              // ...
            }
          });
          
            }
            catch (error) {
                console.log(error.message);
              }
    
}

const adminGetProduct = async (req, res) => {
    try {
        try {
            // console.log("here /admineditproduct");
            const productId = req.query.productId;
            const category =await categoyHelpers.getAllCategory()
            const product = await productHelper.getProductById({ _id: productId });
            console.log("here /admineditproduct",product);
            if (!product) {
              // Handle the case when the product is not found
              return res.redirect('/admin');
            }
           console.log(product.Name,'chkkkkkkkk name')
            res.render('admin/admineditproduct',  { product: product,category  });
          } catch (err) {
            console.log(err);
            res.redirect('/admin'); // Handle the error, e.g., redirect to the admin panel
          }  
    }
    catch (error) {
        console.log(error.message);
      }
}

const getAllUsers= async (req, res) => {
  try {
      userHelpers.getAllUsers()
      .then((users) => {
        // console.log("in/getusersadminp");
        categoyHelpers.getAllCategory()
        .then((category)=>{
          if (users) {
            console.log(users[0].Email,"usercheck");
            res.render('./admin/adminPanel-users', { users ,category});
            console.log(users);
          } else {
            // Handle error
            console.log('Failed to retrieve users');
          }

        })
     
      })
      .catch((error) => {
        console.log('Error retrieving users:', error);
        // Handle error
      });
  }
  catch (error) {
      console.log(error.message);
    }

}

const adminDeleteUser = async (req, res) => {
  try {
      try {
          const userId = req.query.userId; 
          const user = await userHelpers.getUserById(userId); 
          
          if (!user) {
            // Handle the case when the user is not found
            return res.redirect('/admin');
          }
      
          
          await userHelpers.deleteUserById(userId);
      
          // Handle the success case, e.g., redirect to the admin panel with a success message
          res.redirect('/admin/allUsers');
        } catch (err) {
          console.log(err);
          // Handle the error, e.g., redirect to the admin panel with an error message
          res.redirect('/admin');
        }
  }
  catch (error) {
      console.log(error.message);
    }
}

const adminGetUser = async (req, res) => {
  try {
      try {
          const userId = req.query.userId; 
         
          const user = await userHelpers.getUserById({ _id: userId }); 
          console.log("here /adminedituser", user);
          if (!user) {
            // Handle the case when the user is not found
            return res.redirect('/admin');
          }
      
          res.render('admin/adminedituser', { user: user,category }); 
        } catch (err) {
          console.log(err);
          res.redirect('/admin'); // Handle the error, e.g., redirect to the admin panel
        }
  }
  catch (error) {
      console.log(error.message);
    }
}




const adminDeleteProduct = async (req, res) => {
  try {
      try {
          const productId = req.query.productId;
          const product = await productHelper.getProductById({ _id: productId });
          
          if (!product) {
            // Handle the case when the product is not found
            return res.redirect('/admin');
          }
      
          // Assuming you have a deleteProductById function in your productHelpers
          await productHelper.softDeleteProduct(productId);
      
          // Handle the success case, e.g., redirect to the admin panel with a success message
          res.redirect('/admin/adminAllproducts');
        } catch (err) {
          console.log(err);
          // Handle the error, e.g., redirect to the admin panel with an error message
          res.redirect('/admin/adminAllproducts');
        }
  }
  catch (error) {
      console.log(error.message);
    }
}

const adminBlockUser = async (req, res) => {
  try {
      console.log(req.query.userId,"blockkkk");
      userHelpers.updateUserBlockedStatus(req.query.userId).then(()=>{
        res.redirect('/admin/allUsers');
      })
  }
  catch (error) {
      console.log(error.message);
    }
}
const adminUnBlockUser = async (req, res) => {
  try {
      console.log(req.query.userId,"Unnn_blockkkk");
      userHelpers.updateUserUnBlockedStatus(req.query.userId).then(()=>{
        res.redirect('/admin/allUsers');
      })
  }
  catch (error) {
      console.log(error.message);
    }
}

const adminEditProduct= async (req, res) => {
  try {
      productHelper.updateProduct(req.params.id,req.body).then(()=>{
        console.log('hiiiiiiiiiiiiiiiiii'+req.files);
          res.redirect('/admin')
          if(req.files){
            let image =req.files.Image
            image.mv('./public/images/'+req.params.id+0+'.jpg')
          }
        }) 
  }
  catch (error) {
      console.log(error.message);
    }

}


module.exports={
    getAdminLogin,
    adminAddProductPage,
    adminAddProduct,
    verifyAdmin,
    logOut,
    login,
    adminGetProduct,
    getAllUsers,
    adminDeleteUser,
    adminGetUser,
    adminDeleteProduct,
    adminBlockUser,
    adminUnBlockUser,
    adminEditProduct
      
}