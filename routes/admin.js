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

router.get("/viewusers", controller.getallUser);

router.get('/blockUser/:id', controller.blockUser);
router.get('/unblockuser/:id',controller.unblockUser);

router.get('/viewcategory',controller.category);
router.get('/addcategory',controller.addCategorypage);
router.get('/editcategory/:id',controller.editCategorypage)
router.get('/unlistCategory/:id',controller.unlistCategory);
router.get('/listCategory/:id',controller.listCategory);


router.get('/addproduct',controller.addProductpage)
router.get('/viewproducts',controller.getallProduct)
router.get('/editproduct/:id',controller.updateProductpage)
//router.get('/deleteproduct/:id',controller.deleteProduct)
router.get('/unlistproduct/:id',controller.unlistProduct);
router.get('/listproduct/:id',controller.listProduct);

router.get('/addcoupen',controller.addCoupenpage);
router.get('/viewcoupen',controller.viewCoupen);

router.get('/viewbanner',controller.getallBanner);
router.get('/addbanner',controller.addBannerpage);
router.get('/editbanner/:id',controller.editBannerpage);
router.get('/enable/:id', controller.enableBanner);
router.get('/disable/:id',controller.disableBanner);


router.get('/vieworder',controller.viewOrder)
router.get('/ordersummary/:id',controller.getOrderDetails)








//logout


router.get("/adminlogout", controller.logout)

//POST,

router.post("/adminlogin", controller.doLogin);

router.post('/addcategory',controller.addCategory);
router.post('/editcategory/:id',controller.editCategory);

router.post('/addproduct',upload.array("image",10),controller.addProduct);
router.post('/editproduct/:id',upload.array("image",10),controller.updateProduct)

router.post('/addcoupen',controller.addCoupen);
router.post('/deletecoupen/:id',controller.deleteCoupen);




router.post('/addbanner',upload.array("image",10),controller.addBanner);
router.post('/deletebanner/:id',controller.deletebanner);
router.post('/editbanner/:id',upload.single("image"),controller.editBanner)
router.post('/deliverystatus/:id',controller.deliveryStatus)




  




module.exports = router;
