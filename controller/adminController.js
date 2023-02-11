const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const CoupenModel = require("../models/coupenModel");
const BannerModel = require("../models/bannerModel");
const mongoose = require("mongoose");
const session = require("express-session");
const saltRounds = 12;
const bcrypt = require("bcryptjs");

const { request } = require("express");
const orderModel = require("../models/orderModel");
const { handleDuplicate } = require('../Error/dbError')
const {coupenDuplicate} =require('../Error/dbError')
const sharp = require('sharp')
module.exports = {
  //********************************************Login Page************************************************************ */

  login: (req, res, next) => {
    try {
      if (req.session.doLogin) {
        res.render("admin/adminhome");
        console.log("login sucess");
      } else {
        console.log("login failed");
        res.render("admin/adminlogin");
      }
    } catch (err) {
      next(err);
    }
  },
  //********************************************************************************************************************* */
  doLogin: async (req, res, next) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
      console.log(email, password, "fghjkl");
      const admin = await AdminModel.findOne({ email: email, password: password });
      console.log(admin,"lll");
      if (admin) {
        req.session.doLogin = true;
        req.session.message = {
          type: 'success',
          message: 'Login Successful'
        }
        return res.redirect("/admin/adminhome");
       
      } else {
         req.session.Login = false;
        req.session.adminLoggedIn = false
        req.session.message = {
          type: 'danger',
          message: 'Invalid password'
        }
        console.log("not admin")
        return res.redirect("/admin");
      }
      // const isMatch = await bcrypt.compare(password,password);
      // console.log("is match ", isMatch)
      //       if (!isMatch) {
      //           return res.redirect('/admin/adminlogin')
      //       }

    } catch (err) {
      next(err);
    }
  },

  // ***************************************************************************************************************
  Home: async (req, res, next) => {
    try {
      
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      let salesChart = await orderModel.aggregate([
        {
          $match: {
            order_status: { $ne: "pending" },
            ordered_date: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$ordered_date" } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      console.log(salesChart)
      const users = await UserModel.find({}).count();
      console.log(users, "jj")
      const products = await ProductModel.find({}).count()
      console.log(products, "ppp")
      const categories = await CategoryModel.find({}).count()
      const order = await orderModel.find({ order_status: { $ne: "pending" } }).count()
      let orders = await orderModel.find({ order_status: { $ne: "pending" } }).populate('products.productid').populate('userId').sort({ ordered_date: -1 }).limit(10)
      const codcount = await orderModel.find({ 'payment.payment_method': "cash_on_delivery" }).count()
      const onlinecount = await orderModel.find({  'payment.payment_method':"Online_payment" }).count()
      console.log(codcount,onlinecount,"asdfghjkl;")


      res.render("admin/adminhome", { users, products, categories, order, orders, salesChart ,codcount,onlinecount});

    } catch (err) {
      next(err)
    }

  },
  // *********************************************************************************************************************
  getallUser: async (req, res, next) => {
    try {
      const users = await UserModel.find({}).sort({ date: -1 });
      res.render("admin/viewusers", { users, index: 1 });
    } catch (err) {
      next(err);
    }
  },

  //*************************************************************************************************************** */
  //Block user

  blockUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      await UserModel.findByIdAndUpdate(
        { _id: id },
        { $set: { status: false } }
      ).then(() => {
        res.redirect("/admin/viewusers");
      });
    } catch (err) {
      next(err);
    }
  },
  unblockUser: async (req, res) => {
    try {
      const id = req.params.id;
      await UserModel.findByIdAndUpdate(
        { _id: id },
        { $set: { status: true } }
      ).then(() => {
        res.redirect("/admin/viewusers");
      });
    } catch (err) {
      next(err);
    }
  },

  //Category

  category: async (req, res) => {
    try {
      const category = await CategoryModel.find();
      res.render("admin/viewcategory", { category })
    } catch (err) {
      next(err);
    }
  },

  addCategorypage: (req, res, next) => {
    try {
      res.render("admin/addcategory", { errors: '' });
    } catch (err) {
      next(err);
    }
  },

  addCategory: async (req, res) => {
    try {
      const newCategory = CategoryModel({
        categoryName: req.body.categoryName,
      });
      const newItem = await newCategory.save()
      if (!newItem) {
        res.redirect("/admin/viewcategory");
      }
    } catch (err) {
      const error = { ...err };
      console.log(error.code)
      let errors
      if (error.code === 11000) {

        errors = handleDuplicate(error)
        res.render('admin/addcategory', { errors })
      }
    }
  },
  //render category page

  editCategorypage: async (req, res, next) => {
    try {
      let id = req.params.id;
      console.log(id);
      const category = await CategoryModel.findOne({ _id: id });

      res.render("admin/editcategory", { category });
    } catch (err) {
      next(err);
    }
  },
  //update category
  editCategory: async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await CategoryModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            categoryName: req.body.categoryName,
          },
        }
      );
      category.save().then(() => {
        res.redirect("/admin/viewcategory");
      });
    } catch (err) {
      next(err);
    }
  },

  //Delete category
  unlistCategory: async (req, res, next) => {
    try {
      let id = req.params.id;
      await CategoryModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            deleted: true,
          },
        }
      );
      res.redirect("/admin/viewcategory");
    } catch (err) {
      next(err);
    }
  },
  listCategory: async (req, res, next) => {
    try {
      let id = req.params.id;
      await CategoryModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            deleted: false,
          },
        }
      );
      res.redirect("/admin/viewcategory");
    } catch (err) {
      next(err);
    }
  },

  //add products
  //rendering addproduct page
  addProductpage: async (req, res, next) => {
    try {
      const category = await CategoryModel.find({ deleted: false });
      const product = await ProductModel.find().populate("category");
      console.log(product);
      res.render("admin/addproduct", { category, product });
    } catch (err) {
      next(err);
    }
  },
  //add products
  addProduct: async (req, res, next) => {
    const { productName, category, description, price, quantity, instock, stockvalue, image } = req.body;
    console.log(req.body);
    try {
      //  const imageURL = req.files
      // let imageUrl = [];
      // if (images) {
      //   image.forEach((element) => {
      //     imageUrl.push(element.path);
      //   });
      // }

      const image = req.files.map((file) => file.filename);
      //const image=req.files
      const newproduct = await ProductModel({
        productName,
        category: category,
        description,
        price,
        quantity,
        image: image,
        instock,
        stockvalue: stockvalue
      });
      newproduct.save().then(() => {
        res.redirect("/admin/viewproducts");
        console.log(newproduct);
      });
    } catch (err) {
      next(err);
    }
  },

  //viewproducts
  getallProduct: async (req, res, next) => {
    try {
      const category = await CategoryModel.find();
      const product = await ProductModel.find({});
      res.render("admin/viewproducts", { product, index: 1, category }).sort({ date: -1 });;
    } catch (err) {
      next(err);
    }
  },

  updateProductpage: async (req, res, next) => {
    try {
      const id = req.params.id;
      const category = await CategoryModel.find({});
      const product = await ProductModel.findById({ _id: id }).populate('category')

      res.render("admin/editproduct", { product, category });
    } catch (err) {
      next(err);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      //console.log(req.body,'here');
      // const category = await CategoryModel.find({_id:req.body});
      const category = req.body.category;
      const id = req.params.id;
      console.log(id)
      const stock = req.body.instock == 'true' ? true : false
      console.log(stock, 'stock');
      if (req.files.length > 0) {
        //const image = req.files.map((file) => file.filename);

        let image = []
        let promises = [];
        req.files.forEach((file) => {
          promises.push(new Promise((resolve, reject) => {
            const filename = file.originalname.replace(/\..+$/, '')
            const newFilename = `${filename}-${Date.now()}.jpeg`
            sharp(file.path)
              .resize({ width: 900, height: 900 })
              .jpeg({
                quality: 100,
                chromaSubsampling: '4:4:4'
              })
              .toFile(`public/uploads/${newFilename}`)
            image.push(newFilename)
            console.log(newFilename);
            resolve();
          }));

        })


        //console.log(image,"dfghj")


        const product = await ProductModel.findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              productName: req.body.productName,
              category: category._id,
              description: req.body.description,
              image: image,
              price: req.body.price,
              quantity: req.body.quantity,
              instock: stock,
              stockvalue: req.body.stockvalue
            },
          }
        );

        product.save().then(() => {
          res.redirect("/admin/viewproducts");
        });

      }
    } catch (err) {
      next(err);
    }
  },


  unlistProduct: async (req, res, next) => {
    try {
      let id = req.params.id;
      await ProductModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            instock: false,
          },
        }
      );
      res.redirect("/admin/viewproducts");
    } catch (err) {
      next(err);
    }
  },
  listProduct: async (req, res, next) => {
    try {
      let id = req.params.id;
      await ProductModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            instock: true,
          },
        }
      );

      res.redirect("/admin/viewproducts");
    } catch (err) {
      next(err);
    }
  },

  //Coupen Management

  //addCoupen page rendering

  addCoupenpage: (req, res) => {
    res.render("admin/addcoupen",{ errors: '' });
  },
  viewCoupen: async (req, res) => {
    try {
      const coupen = await CoupenModel.find();
      res.render("admin/viewcoupen", { coupen, index: 1 });
    } catch (err) {
      next(err);
    }
  },

  addCoupen:async (req, res, next) => {
    try {
      const coupen = CoupenModel({
        coupenCode: req.body.coupenCode,
        status: req.body.status,
        amount: req.body.amount,
        minOrder: req.body.minOrder,
        expirydate: req.body.expirydate,
      });
    let coup= await  coupen.save()
  
      res.redirect("/admin/viewcoupen");
    
    } catch (err) {
      const error = { ...err };
      console.log(error.code+"ERROR CODE")
      let errors
      if (error.code === 11000) {
        errors=coupenDuplicate(error)
        console.log(errors+"ERORSSS");
        res.render('admin/addcoupen', { errors })
      }
    }
  },
  // Delete Product
  deleteCoupen: async (req, res) => {
    try {
      let id = req.params.id;
      await CoupenModel.findByIdAndDelete({ _id: id });

      res.redirect("/admin/viewcoupen");
    } catch (err) {
      next(err);
    }
  },

  //view banner
  getallBanner: async (req, res) => {
    const banner = await BannerModel.find({});
    res.render("admin/viewbanner", { banner });
  },
  //add Banner
  addBannerpage: (req, res) => {
    try {
      res.render("admin/addbanner");
    } catch (err) {
      next(err);
    }
  },
  addBanner: async (req, res, next) => {
    try {
      const image = req.files.map((file) => file.filename);
      const banner = await BannerModel({
        bannerName: req.body.bannerName,
        description: req.body.description,
        image: image,
      });
      banner.save().then(() => {
        res.redirect("/admin/viewbanner");
      });
    } catch (err) {
      next(err);
    }
  },
  // Delete Product
  deletebanner: async (req, res) => {
    try {
      let id = req.params.id;
      await BannerModel.findByIdAndDelete({ _id: id });

      res.redirect("/admin/viewbanner");
    } catch (err) {
      next(err);
    }
  },
  // editBannerpage:async(req,res)=>{
  //   let id=req.params.id;
  //   const banner=await BannerModel.findById({_id:id});
  //   res.render('admin/editbanner',{banner});

  // },

  editBannerpage: (req, res) => {
    let id = req.params.id;
    BannerModel.findById(id, (err, banner) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin/editbanner", { banner });
      }
    });
  },


  editBanner: async (req, res, next) => {
    try {
      console.log(req.body.image);
      const id = req.params.id;
      const banner = {
        bannerName: req.body.bannerName,
        description: req.body.description,
      };
      if (req.file) {
        banner.image = req.file.filename;
      }
      console.log(banner);
      await BannerModel.findOneAndUpdate({ _id: id }, { $set: banner });

      res.redirect("/admin/viewbanner");
    } catch (err) {
      next(err);
    }
    // let newimage = ''
    // if(req.file){
    //   newimage=req.file.filename
    // }
    // else{
    //   newimage=req.body.oldimage
    // }
    // const { bannerName,description }=req.body
    // BannerModel.findOneAndUpdate({_id:id},{
    //   bannerName:req.body.bannerName,
    //   description:req.body.description,
    //   image:newimage
    // })
  },

  enableBanner: async (req, res, next) => {
    try {
      const id = req.params.id;
      await BannerModel.updateOne(
        { _id: id },
        { $set: { status: true } }
      ).then(() => {
        res.redirect("/admin/viewbanner");
      });
    } catch (err) {
      next(error);
    }
  },
  disableBanner: async (req, res) => {
    try {
      const id = req.params.id;
      await BannerModel.updateOne(
        { _id: id },
        { $set: { status: false } }
      ).then(() => {
        res.redirect("/admin/viewbanner");
      });
    } catch (err) {
      next(error);
    }
  },
  viewOrder: async (req, res, next) => {
    try {
      const order = await orderModel.find({order_status:"completed"}).populate('userId').sort({ ordered_date: -1 });
      res.render('admin/vieworder', { order })

    } catch (err) {
      next(error)
    }
  },

  getOrderDetails: async (req, res, next) => {
    try {

      const id = req.params.id
      console.log(id)
      const order = await orderModel.findById({ _id: id }).populate('products.productid')
      console.log(order, "*********************************************************")
      res.render('admin/ordersummary', { order })


    } catch (err) {
      next(error)
    }

  },
  deliveryStatus: async (req, res) => {
    try {
      console.log(req.body)
      let orderid = req.params.id
      console.log(orderid)
      if (req.body.deliveryStatus == 'shipped') {
        orderModel.updateOne({ _id: orderid }, { $set: { 'delivery_status.shipped.state': true, 'delivery_status.shipped.date': Date.now() } }).then((data) => {
          res.redirect('/admin/ordersummary/' + orderid)
        })
      } else if (req.body.deliveryStatus == 'outForDelivery') {
        orderModel.updateOne({ _id: orderid }, { $set: { 'delivery_status.out_for_delivery.state': true, 'delivery_status.out_for_delivery.date': Date.now() } }).then((data) => {
          res.redirect('/admin/ordersummary/' + orderid)
        })
      } else if (req.body.deliveryStatus == 'delivered') {
        orderModel.updateOne({ _id: orderid }, { $set: { 'delivery_status.delivered.state': true, 'delivery_status.delivered.date': Date.now() } }).then((data) => {
          res.redirect('/admin/ordersummary/' + orderid)
        })
      }

    } catch (err) {
      next(error)
    }

  },
  invoice: async (req, res, next) => {
    try {
      console.log(req.params.id)
      let invoice = await orderModel.findOne({ _id: req.params.id })
        .populate("products.productid").populate('userId')
      res.render("admin/invoice", { invoice })
      console.log(invoice)



    } catch (err) {
      next(err)
    }
  },

  salesReport: (req, res, next) => {
    try {
      console.log("salesreport")
      res.render('admin/salesreport')

    } catch (err) {
      next(err)
    }

  },

  salesDetails:async(req,res,next)=>{
    try{
      console.log(req.body)
      let salesdetails = await orderModel.aggregate([
        {
          $match: {
            $and: [
              { order_status: "completed" },
              { "delivery_status.delivered.state": true },
              { ordered_date: { $gt: new Date(req.body.from) } },
              { ordered_date: { $lt: new Date(req.body.to) } },
            ],
          },
        },
        {
          $lookup: {
            from: "userdatas",
            localField: "userId",
            foreignField: "_id",
            as: "userid",
          },
        },
        { $sort: { ordered_date: -1 } },
      ]);
      console.log(salesdetails)
      res.render("admin/salesdetails", {salesdetails});

    }catch(err){
      console.log(error)
      next(err)
    }

  },

  logout: (req, res,next) => {
    try {
      console.log("admin logout");
      req.session.Login = true;
      req.session.destroy();
      res.redirect("/admin");
    } catch (err) {
      next(err);
    }
  },

};
