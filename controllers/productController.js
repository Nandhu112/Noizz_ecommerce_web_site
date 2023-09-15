const productHelper = require('../helpers/productHelper');
const categoyHelpers = require('../helpers/categoryHelper');
const countHelper = require("../helpers/countHelper")

const adminAddProductPage = async (req, res) => {

  try {
    try {
      const promises = [
        categoyHelpers.getAllCategory()
      ];
      Promise.all(promises)
        .then(([category]) => {
          res.render('./admin/add-product', { category });
        })
        .catch((error) => {

          // Handle error
        });


    }
    catch (err) {

      res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const allProducts = async (req, res) => {
  try {
    let num = [1]
    try {
      const promises = [
        productHelper.getAllProducts(),
        categoyHelpers.getAllCategory()
      ];
      Promise.all(promises)
        .then(async ([products, category]) => {
          const userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)
          const cartCount = await countHelper.cartCount(req.session.user1._id)
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
          res.render('./user/allproducts', { home: true, products: paginatedProducts, category, userWishlistCount, cartCount, num, currentPage, totalPages, pages });
        })
        .catch((error) => {

        });

    }
    catch (err) {

      res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const userGetCategoryProduct = async (req, res) => {
  try {


    cName = req.query.category
    const promises = [
      categoyHelpers.getCategory(cName),
      categoyHelpers.getAllCategory()
    ];

    Promise.all(promises)
      .then(([cProducts, category]) => {

        res.render('./user/allproducts', { products: cProducts, category });
      })
      .catch((error) => {
      });
  }
  catch (error) {

    res.render("error-404");
  }
}

const getProductDetails = async (req, res) => {
  const cartCount = await countHelper.cartCount(req.session.user1._id)
  const userWishlistCount = await countHelper.wishlistCount(req.session.user1._id)

  try {
    let id = req.query.id
    const product = await productHelper.getProductById({ _id: id });
    if (!product) {
      return res.redirect('/login');
    } else {
      const context = {
        items: [0, 1]
      };
      res.render('./user/productDetailsPage', { product, context, cartCount, userWishlistCount });
    }
  } catch (err) {

    res.redirect('/home');
  }
}


const searchProduct = async (req, res) => {
  try {

    const query = req.query.name
    const products = await productHelper.searchProducts(query)
    if (products) {
      res.render("./user/allproducts", { products })
    } else res.send("Error geting user data")
  }

  catch (error) {

    res.render("error-404");
  }
}

const filterProducts = (async (req, res) => {

  const proCat = req.body.proCat
  const sortcount = req.body.sort
  const priceRange = req.body.range
  const search = req.body.search

  let min
  let max
  if (!priceRange) {
    min = 0
    max = 500000
  }
  else {
    const isOneInArray = priceRange.includes('1');
    const isTwoInArray = priceRange.includes('2');
    const isThreeInArray = priceRange.includes('3');
    if (isOneInArray) {
      min = 0
    } else if (isTwoInArray) {
      min = 200000
    }
    else {
      min = 300000
    }

    if (isThreeInArray) {
      max = 500000
    }
    else if (isTwoInArray) {
      max = 300000
    }
    else {
      max = 100000
    }
  }
  let priceRanges =
  {
    min: min,
    max: max
  }


  if (proCat) {
    const productss = await categoyHelpers.getFilterCategory(proCat, sortcount, priceRanges, search)
    const itemsPerPage = 6;
    let currentPage = parseInt(req.body.page);
    if (isNaN(currentPage)) {
      currentPage = 1;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productss.slice(startIndex, endIndex);
    const totalPages = Math.ceil(productss.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    let products = paginatedProducts

    res.json({ products, currentPage, totalPages, pages })
  }
  else {
    const productss = await categoyHelpers.getAllFilterProducts(sortcount, priceRanges, search)
    const itemsPerPage = 6;
    let currentPage = parseInt(req.body.page);
    if (isNaN(currentPage)) {
      currentPage = 1;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = productss.slice(startIndex, endIndex);
    const totalPages = Math.ceil(productss.length / itemsPerPage);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    let products = paginatedProducts

    res.json({ products, currentPage, totalPages, pages })
  }

})


module.exports = {
  adminAddProductPage,
  allProducts,
  userGetCategoryProduct,
  getProductDetails,
  searchProduct,
  filterProducts


}