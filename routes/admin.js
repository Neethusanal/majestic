const express = require("express");
const router = express.Router();
const controller = require("../controller/adminController");
const saltRounds = 12;
const bcrypt = require("bcryptjs");
const multer=require("multer");
const path = require('path')
const session=require("../Middleware/sessionhandling")



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
router.get("/adminhome", controller.Home);

router.get("/viewusers",session.adminSession, controller.getallUser);

router.get('/blockUser/:id',session.adminSession, controller.blockUser);
router.get('/unblockuser/:id',session.adminSession,controller.unblockUser);

router.get('/viewcategory',session.adminSession,controller.category);
router.get('/addcategory',session.adminSession,controller.addCategorypage);
router.get('/editcategory/:id',session.adminSession,controller.editCategorypage)
router.get('/unlistCategory/:id',session.adminSession,controller.unlistCategory);
router.get('/listCategory/:id',session.adminSession,controller.listCategory);


router.get('/addproduct',session.adminSession,controller.addProductpage)
router.get('/viewproducts',session.adminSession,controller.getallProduct)
router.get('/editproduct/:id',session.adminSession,controller.updateProductpage)
//router.get('/deleteproduct/:id',controller.deleteProduct)
router.get('/unlistproduct/:id',session.adminSession,controller.unlistProduct);
router.get('/listproduct/:id',session.adminSession,controller.listProduct);

router.get('/addcoupen',session.adminSession,controller.addCoupenpage);
router.get('/viewcoupen',session.adminSession,controller.viewCoupen);

router.get('/viewbanner',session.adminSession,controller.getallBanner);
router.get('/addbanner',session.adminSession,controller.addBannerpage);
router.get('/editbanner/:id',session.adminSession,controller.editBannerpage);
router.get('/enable/:id',session.adminSession,controller.enableBanner);
router.get('/disable/:id',session.adminSession,controller.disableBanner);


router.get('/vieworder',session.adminSession,controller.viewOrder)
router.get('/ordersummary/:id',session.adminSession,controller.getOrderDetails)
router.get('/invoice/:id',session.adminSession,controller.invoice);
router.get('/salesreport',session.adminSession,controller.salesReport)








//logout


router.get("/adminlogout", controller.logout);

//POST,

router.post("/adminlogin", controller.doLogin);

router.post('/addcategory',session.adminSession,controller.addCategory);
router.post('/editcategory/:id',session.adminSession,controller.editCategory);

router.post('/addproduct',session.adminSession,upload.array("image",10),controller.addProduct);
router.post('/editproduct/:id',session.adminSession,upload.array("image",10),controller.updateProduct)

router.post('/addcoupen',session.adminSession,controller.addCoupen);
router.post('/deletecoupen/:id',controller.deleteCoupen);




router.post('/addbanner',session.adminSession,upload.array("image",10),controller.addBanner);
router.post('/deletebanner/:id',controller.deletebanner);
router.post('/editbanner/:id',session.adminSession,upload.single("image"),controller.editBanner)
router.post('/deliverystatus/:id',session.adminSession,controller.deliveryStatus)
router.post('/salesdetails',session.adminSession,controller.salesDetails)




  




module.exports = router;
