const productHelper = require('../helpers/productHelper');
const adminHelpers = require("../helpers/adminHelpers")
const userHelpers = require("../helpers/userHelpers")
const categoyHelpers = require('../helpers/categoryHelper');


const getAdminLogin = async (req, res) => {

  try {
    try {

      const promises = [
        productHelper.getAllProducts(),
        categoyHelpers.getAllCategory()

      ];
      Promise.all(promises)
        .then(([products, category]) => {

          res.render('./admin/adminAllproductsList', { products, category });
        })
        .catch((error) => {

        });


    }
    catch (err) {

      res.redirect('/login');
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const login = async (req, res) => {

  try {
    if (req.session.user) {
      res.redirect('/admin')
    }
    else {
      res.render('./admin/adminLogin')

    }

  }
  catch (error) {

    res.render("error-404");
  }
}


const logOut = async (req, res) => {
  try {
    req.session.admin = false
    res.redirect('/admin')
  }
  catch (error) {

    res.render("error-404");
  }
}

const verifyAdmin = async (req, res) => {

  try {
    try {
      const email = req.body.email;
      const password = req.body.password
      const admin = await userHelpers.getAdminByMail({ email, password });
      if (admin.Admin) {
        req.session.admin = true
        return res.redirect('/admin');
      }
      else {
        res.render('./admin/adminLogin');
      }
    } catch (err) {

      res.redirect('/');
    }
  }
  catch (error) {

    res.render("error-404");
  }
}



const adminAddProductPage = async (req, res) => {
  try {
    res.render('./admin/add-product')
  }
  catch (error) {

    res.render("error-404");
  }
}

const adminAddProduct = async (req, res) => {

  try {

    productHelper.addProduct(req.body, (id) => {

      if (req.files && req.files['images[]']) {
        const images = req.files['images[]'];
        const movePromises = [];
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const movePromise = new Promise((resolve, reject) => {
            image.mv('./public/images/' + id + i + '.jpg', (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
          movePromises.push(movePromise);
        }
        Promise.all(movePromises)
          .then(() => {
            res.render("admin/add-product")
          })
          .catch((error) => {

            res.status(500).send('Failed to add product');
          });
      } else {

      }
    });

  }
  catch (error) {

    res.render("error-404");
  }

}

const adminGetProduct = async (req, res) => {
  try {
    try {
      const productId = req.query.productId;
      const category = await categoyHelpers.getAllCategory()
      const product = await productHelper.getProductById({ _id: productId });
      if (!product) {
        return res.redirect('/admin');
      }

      res.render('admin/admineditproduct', { product: product, category });
    } catch (err) {
      res.redirect('/admin');
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const getAllUsers = async (req, res) => {
  try {
    userHelpers.getAllUsers()
      .then((users) => {
        categoyHelpers.getAllCategory()
          .then((category) => {
            if (users) {
              res.render('./admin/adminPanel-users', { users, category });

            } else {

            }

          })

      })
      .catch((error) => {


      });
  }
  catch (error) {

    res.render("error-404");
  }

}

const adminDeleteUser = async (req, res) => {
  try {
    try {
      const userId = req.query.userId;
      const user = await userHelpers.getUserById(userId);
      if (!user) {
        return res.redirect('/admin');
      }


      await userHelpers.deleteUserById(userId);
      res.redirect('/admin/allUsers');
    } catch (err) {

      res.redirect('/admin');
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const adminGetUser = async (req, res) => {
  try {
    try {
      const userId = req.query.userId;

      const user = await userHelpers.getUserById({ _id: userId });
      if (!user) {
        return res.redirect('/admin');
      }

      res.render('admin/adminedituser', { user: user, category });
    } catch (err) {

      res.redirect('/admin'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  catch (error) {

    res.render("error-404");
  }
}




const adminDeleteProduct = async (req, res) => {
  try {
    try {
      const productId = req.query.productId;
      const product = await productHelper.getProductById({ _id: productId });

      if (!product) {
        return res.redirect('/admin');
      }
      await productHelper.softDeleteProduct(productId);
      res.redirect('/admin/adminAllproducts');
    } catch (err) {

      res.redirect('/admin/adminAllproducts');
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const adminBlockUser = async (req, res) => {
  try {
    userHelpers.updateUserBlockedStatus(req.query.userId).then(() => {
      res.redirect('/admin/allUsers');
    })
  }
  catch (error) {

    res.render("error-404");
  }
}
const adminUnBlockUser = async (req, res) => {
  try {
    userHelpers.updateUserUnBlockedStatus(req.query.userId).then(() => {
      res.redirect('/admin/allUsers');
    })
  }
  catch (error) {

    res.render("error-404");
  }
}

const adminEditProduct = async (req, res) => {
  try {
    productHelper.updateProduct(req.params.id, req.body).then(() => {
      res.redirect('/admin')
      if (req.files) {
        let image = req.files.Image
        image.mv('./public/images/' + req.params.id + 0 + '.jpg')
      }
    })
  }
  catch (error) {

    res.render("error-404");
  }

}


module.exports = {
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