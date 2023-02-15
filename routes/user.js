const express = require("express");
const router = express.Router();
const controller = require("../controller/userController");
const saltRounds = 12;
const bcrypt = require("bcryptjs");
const session=require("../Middleware/sessionhandling")
const {paginate} = require('../Middleware/pagination')
const ajaxauth=require("../Middleware/Ajaxauth")
const ProductModel=require("../models/productModel")


//get
router.get("/", controller.Home);
router.get("/login", controller.Login);
router.get("/signup", controller.Signup);
router.get("/forgetpassword",controller.forgetPasswordpage)
router.get('/resetpassword',controller.resetPasswordpage)
router.get("/shop",paginate, controller.getallProducts);
router.get("/singleproduct/:id",controller.ProductPage);
router.get('/wishlist',session.userSession,controller.wishlistPage)
router.get('/addtowishlist/:id',ajaxauth.verifyAjaxUser,controller.addtowishlist)
  router.get('/search',controller.Search)



router.get("/shoppingcart",session.userSession,controller.shoppingCartpage)
router.get('/add-to-cart',ajaxauth.verifyAjaxUser,controller.addtoCart);
router.get('/checkout/:id',ajaxauth.verifyAjaxUser,controller.checkoutPage)

router.get('/orderdetails',session.userSession,controller.orderDetails);
router.get('/vieworder/:id',session.userSession,controller.viewOrder),


router.get('/userprofile',session.userSession,controller.getuserProfile)
router.get('/about',controller.aboutPage)
router.get('/contact',controller.contactPage)

router.get('/logout',controller.Logout);


//router.post("/signup", controller.userSignup);
router.post("/login", controller.userLogin);
router.post("/otp", controller.Otp);
router.post("/verifyotp", controller.verifyOtp);
router.post("/resendotp", controller.resendOtp);
router.post("/forgetpassword",controller.forgetPassword)
router.post('/resetpassword',controller.resetPassword)
router.post('/category',paginate,controller.getCategory)


router.post('/addaddress',session.userSession,controller.addAddress)
router.post('/editaddress',ajaxauth.verifyAjaxUser,controller.editAddress)
router.post('/updateaddress/:id',ajaxauth.verifyAjaxUser,controller.updateAddress)
router.post('/deleteaddress',ajaxauth.verifyAjaxUser,controller.deleteAddress)
router.post('/deletecartProduct',ajaxauth.verifyAjaxUser,controller.deletecartProduct)
router.post('/removewishlistproduct/:id',controller.removeWishlist)
router.post('/changeQuantity',ajaxauth.verifyAjaxUser,controller.changeQuantity);
router.post('/orderId',session.userSession,controller.orderId)
router.post('/applyCoupon',ajaxauth.verifyAjaxUser,controller.applyCoupon)
router.post('/addnewaddress/:id',session.userSession,controller.addNewaddress)
router.post('/placeOrder/:id',session.userSession,controller.placeOrder)
router.post('/verifypayment',ajaxauth.verifyAjaxUser,controller. verifypayment)
router.post('/cancelOrder',ajaxauth.verifyAjaxUser,controller.cancelOrder)
router.post('/sort',controller.Sort)







module.exports = router;
