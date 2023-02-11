const express = require("express");
const router = express.Router();
const controller = require("../controller/adminController");
const saltRounds = 12;
const bcrypt = require("bcryptjs");
const multer=require("multer");
const path = require('path')
const {adminSession}=require("../Middleware/sessionhandling")



const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype]
      let uploadError = new Error('invalid image type')
  
      if(isValid){
        uploadError = null
      }
      cb(uploadError, './public/uploads')
    },
    filename:async function (req, file, cb) {
      console.log(file);
      const filename = file.originalname.split(' ').join('-')
      const extension =await FILE_TYPE_MAP[file.mimetype]
      cb(null, `${filename}-${Date.now()}.${extension}`)
      console.log(`${filename}-${Date.now()}.${extension}`);
    }
   
  })
   
  const upload = multer({ storage: storage })
  



//GET 

router.get("/", controller.login);
router.get("/adminhome",adminSession, controller.Home);

router.get("/viewusers",adminSession, controller.getallUser);

router.get('/blockUser/:id',adminSession, controller.blockUser);
router.get('/unblockuser/:id',adminSession,controller.unblockUser);

router.get('/viewcategory',adminSession,controller.category);
router.get('/addcategory',adminSession,controller.addCategorypage);
router.get('/editcategory/:id',adminSession,controller.editCategorypage)
router.get('/unlistCategory/:id',adminSession,controller.unlistCategory);
router.get('/listCategory/:id',adminSession,controller.listCategory);

router.get('/addproduct',adminSession,controller.addProductpage)
router.get('/viewproducts',adminSession,controller.getallProduct)
router.get('/editproduct/:id',adminSession,controller.updateProductpage)
//router.get('/deleteproduct/:id',controller.deleteProduct)
router.get('/unlistproduct/:id',adminSession,controller.unlistProduct);
router.get('/listproduct/:id',adminSession,controller.listProduct);

router.get('/addcoupen',adminSession,controller.addCoupenpage);
router.get('/viewcoupen',adminSession,controller.viewCoupen);

router.get('/viewbanner',adminSession,controller.getallBanner);
router.get('/addbanner',adminSession,controller.addBannerpage);
router.get('/editbanner/:id',adminSession,controller.editBannerpage);
router.get('/enable/:id',adminSession,controller.enableBanner);
router.get('/disable/:id',adminSession,controller.disableBanner);


router.get('/vieworder',adminSession,controller.viewOrder)
router.get('/ordersummary/:id',adminSession,controller.getOrderDetails)
router.get('/invoice/:id',adminSession,controller.invoice);
router.get('/salesreport',adminSession,controller.salesReport)








//logout


router.get("/adminlogout",adminSession, controller.logout);

//POST,

router.post("/adminlogin", controller.doLogin);

router.post('/addcategory',adminSession,controller.addCategory);
router.post('/editcategory/:id',adminSession,controller.editCategory);

router.post('/addproduct',adminSession,upload.array("image",10),controller.addProduct);
router.post('/editproduct/:id',adminSession,upload.array("image",10),controller.updateProduct)

router.post('/addcoupen',adminSession,controller.addCoupen);
router.post('/deletecoupen/:id',controller.deleteCoupen);




router.post('/addbanner',adminSession,upload.array("image",10),controller.addBanner);
router.post('/deletebanner/:id',controller.deletebanner);
router.post('/editbanner/:id',adminSession,upload.single("image"),controller.editBanner)
router.post('/deliverystatus/:id',adminSession,controller.deliveryStatus)
router.post('/salesdetails',adminSession,controller.salesDetails)




  




module.exports = router;
