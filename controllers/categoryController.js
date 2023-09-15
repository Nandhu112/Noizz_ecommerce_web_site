const productHelper = require('../helpers/productHelper');
const categoyHelpers = require('../helpers/categoryHelper');


const getAllCategory = async (req, res) => {
  try {
    const category = await categoyHelpers.getAllCategory()
    res.render('./admin/adminPanel-category', { category })
  } catch (error) {

    res.render("error-404");
  }
}

const addCategory = async (req, res) => {
  try {
    res.render('./admin/adminaddCategory')
  } catch (error) {

    res.render("error-404");
  }
}

const InsertCategory = async (req, res) => {
  try {
    try {
      let category = { Category: req.body.cName }
      await categoyHelpers.addCategory(category).then(() => {
        res.redirect('/admin/add-product')
      })
    } catch (error) {

      res.status(500).send('Internal Server Error');
    }
  }
  catch (error) {

    res.render("error-404");
  }
}

const getCategoryProduct = async (req, res) => {
  try {
    cName = req.query.category
    const promises = [
      categoyHelpers.getCategory(cName),
      categoyHelpers.getAllCategory()
    ];
    Promise.all(promises)
      .then(([cProducts, category]) => {
        res.render('./admin/adminAllproductsList', { products: cProducts, category });
      })
      .catch((error) => {

      });
  }
  catch (error) {

    res.render("error-404");
  }
}

const editCategoryPage = async (req, res) => {
  try {
    let categoryId = req.query.categoryId
    let category = req.query.categoryName
    res.render('./admin/admin-editcategory', { category })
  } catch (error) {
    res.render("error-404");
  }
}

const editCategory = async (req, res) => {
  try {
    let prevName = req.body.cName
    let newName = req.body.newcName
    await categoyHelpers.changeCategoryName(prevName, newName)
    await productHelper.changeProductCategoryName(prevName, newName)
    res.redirect('/admin/getAllCategory');
  } catch (error) {
    res.render("error-404");

  }
}

const categoryUnlist = async (req, res) => {
  try {
    try {
      const categoryId = req.query.categoryId;
      const categoryName = req.query.categoryName
      const category = await categoyHelpers.getcategoryById({ _id: categoryId });
      await productHelper.deleteCategoryProducts({ Category: categoryName })
      if (!category) {
        return res.redirect('/admin/getAllCategory');
      }
      await categoyHelpers.categoryUnlist(categoryId);
      res.redirect('/admin/getAllCategory');
    } catch (err) {

      res.redirect('/admin');

    }
  } catch (error) {

    res.render("error-404");
  }
}

const categoryRelist = async (req, res) => {
  try {
    try {
      const categoryId = req.query.categoryId;
      const categoryName = req.query.categoryName
      const category = await categoyHelpers.getcategoryById({ _id: categoryId });
      await productHelper.UndeleteCategoryProducts({ Category: categoryName })
      if (!category) {
        return res.redirect('/admin/getAllCategory');
      }
      let reListed = await categoyHelpers.categoryRelist(categoryId)
      res.redirect('/admin/getAllCategory');
    } catch (err) {

      res.redirect('/admin');
    }

  } catch (error) {

    res.render("error-404");
  }
}

const UnlistedCategory = async (req, res) => {
  try {
    const category = await categoyHelpers.getAllUnlistCategory()
    res.render('./admin/adminPanel-category', { category })
  } catch (error) {

    res.render("error-404");
  }
}



module.exports = {
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