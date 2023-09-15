
const bannerHelper = require('../helpers/bannerHelper');
const categoyHelpers = require('../helpers/categoryHelper');


const addBannerPage = async (req, res) => {
  const category = await categoyHelpers.getAllCategory()
  res.render('./admin/addBanner', { category })
}

const addBanner = async (req, res) => {
  try {
    await bannerHelper.addBannerHelper(req.body, req.files['image']).then((response) => {
      if (response) {
        res.redirect("/admin/addBanner");
      } else {
        res.status(505);
      }
    })
  } catch (error) {

    res.render("error-404");
  }
}

const bannerListPage = async (req, res) => {
  try {
    bannerHelper.bannerListHelper().then((response) => {
      res.render('./admin/bannerList', { banners: response })

    })

  }
  catch (error) {

    res.render("error-404");
  }
}

const editBannerPage = async (req, res) => {
  try {
    await bannerHelper.fetchBanner(req.query.id).then(async (response) => {
      const category = await categoyHelpers.getAllCategory()
      res.render('./admin/editBanner', { banner: response, category })
    })
  } catch (error) {

    res.render("error-404");
  }
}

const editBanner = async (req, res) => {
  try {
    await bannerHelper.editBannerHelper(req.body, req.files['image']).then((response) => {
      if (response) {
        res.redirect("/admin/bannerList");
      } else {
        res.status(505);
      }
    })
  } catch (error) {

    res.render("error-404");
  }
}

const deleteBanner = async (req, res) => {
  try {
    await bannerHelper.deleteBanner(req.query.id).then((response) => {
      if (response) {
        res.redirect('/admin/bannerList')
      }
    })
  } catch (error) {

    res.render("error-404");
  }
}



module.exports = {
  addBannerPage,
  addBanner,
  bannerListPage,
  editBannerPage,
  editBanner,
  deleteBanner
}