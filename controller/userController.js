const UserModel = require("../models/userModel");
const saltRounds = 12;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const BannerModel = require("../models/bannerModel");
const CategoryModel = require("../models/categoryModel");
const ProductModel = require("../models/productModel");
const nodemailer = require("nodemailer");
const CartModel = require("../models/cartModel");
const pagination = require("../Middleware/pagination");
const randomstring = require("randomstring");
const forgetpassword = require("../Middleware/passwordreset");
const userModel = require("../models/userModel");
const session = require("express-session");
const { findOneAndUpdate, castObject } = require("../models/userModel");
const ajaxauth = require("../Middleware/Ajaxauth");
const orderModel = require("../models/orderModel");
const coupenModel = require("../models/coupenModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const productModel = require("../models/productModel");
const WishlistModel=require('../models/wishlistModel')

require("dotenv").config();

//const mailcheck=require("../Middleware/nodemailer")
//Razorpay
var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// paymentId = "pay_JqLHMVryzMEafT"

// instance.payments.fetch(paymentId,{"expand[]":"card"})

//otp verification

let transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,

  auth: {
    user: process.env.ACCOUNT_NAME,
    pass: process.env.ACC_PASS,
  },
});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);

module.exports = {
  Home: async (req, res, next) => {
    try {
      let user = req.session.user;
      const banner = await BannerModel.find({ status: true }).limit(3);
      const product = await ProductModel.find();
      const categories = await CategoryModel.find();

      res.render("user/home", { user, banner, product });
    } catch (err) {}
  },

  //Rendering signup page
  Signup: (req, res) => {
    res.render("user/signup");
  },
  //Signup with otp:

  Otp: async (req, res, next) => {
    try {
      req.session.fullName = req.body.fullName;
      req.session.userName = req.body.userName;
      req.session.email = req.body.email;
      req.session.phone = req.body.phone;
      req.session.password = req.body.password;
      console.log(req.session.fullName);

      Email = req.body.email;
      console.log(req.body);
      const user = await UserModel.findOne({ email: Email });
      if (!user) {
        const mailoptions = {
          from: process.env.ACCOUNT_NAME,
          to: req.session.email,
          subject: "OTP for registration is :",
          html:
            "<h3>OTP for account verification is </h3>" +
            "<h1 style='font-weight:bold;'>" +
            otp +
            "</h1>",
        };

        transporter.sendMail(mailoptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          res.render("user/otp");
        });
      } else {
        res.redirect("/signup");
      }
    } catch (err) {
      next(err);
    }
  },
  verifyOtp: async (req, res, next) => {
    console.log("verifyotp");
    console.log(req.body.otp, "form otp");
    console.log(otp);
    try {
      if (req.body.otp == otp) {
        req.session.password = await bcrypt.hash(req.session.password, 10);
        console.log(req.session.password);
        let newUser = UserModel({
          fullName: req.session.fullName,
          userName: req.session.userName,
          email: req.session.email,
          phone: req.session.phone,
          password: req.session.password,
        });

        let data = newUser.save();
        console.log(data);
        res.redirect("/login");
      } else {
        res.render("user/otp");
      }
    } catch (err) {
      next(err);
    }
  },
  resendOtp: (req, res, next) => {
    console.log("resend");
    try {
      const mailoptions = {
        from: process.env.ACCOUNT_NAME,
        to: req.session.email,
        subject: "OTP for registration is :",
        html:
          "<h3>OTP for account verification is </h3>" +
          "<h1 style='font-weight:bold;'>" +
          otp +
          "</h1>",
      };

      transporter.sendMail(mailoptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render("user/otp");
      });
    } catch (err) {
      next(err);
    }
  },

  Login: (req, res) => {
    if (req.session.userLogin) {
      // res.render("user/home");
      res.redirect("/");
    } else {
      res.render("user/login", { status: true });
    }
  },

  //creating new users
  //  userSignup: (req, res) => {
  //    try {
  //      bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
  //        const newuser = UserModel({
  //         fullName: req.body.fullName,
  //          userName: req.body.userName,
  //        email: req.body.email,
  //          phone: req.body.phone,
  //          password: hash,
  //       });

  //        newuser.save().then(() => {
  //          res.redirect("/");
  //          console.log(newuser);
  //        });
  //      });
  //    } catch (e) {
  //    console.log(e.message);
  //   }
  //  },

  //Rendering login page

  //user login

  userLogin: async (req, res, next) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      console.log(email, password);
      const user = await UserModel.findOne({
        email: email,
        status: "true",
      });

      if (!user) {
        return res.render("user/login", { status: "true" });
        console.log("dfghj");
      }
      console.log("tttttttttt");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.redirect("/user/login", { status: true });
      }
      // if (user.status == false) {
      //   return res.render("user/login");
      //   console.log("banned")
      // }
      req.session.user = user;
      req.session.userId = user._id;
      req.session.userLogin = true;
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
  forgetPasswordpage: (req, res) => {
    res.render("user/forgetpassword");
  },

  forgetPassword: async (req, res, next) => {
    try {
      const email = req.body.email;
      //console.log(email)
      const saveduser = await UserModel.findOne({ email: email });
      console.log(saveduser);
      console.log("ghjkl");
      if (saveduser) {
        const randomString = randomstring.generate();
        //console.log(randomString,"random")
        if (saveduser.email != email) {
          res.render("user/forgetPassword"),
            { mesage: "please verify the email" };
        } else {
          const newData = await UserModel.updateOne(
            { email: email },
            { $set: { token: randomString } }
          );
          //console.log(saveduser.token,"sdfghjkl")
          //console.log(newData,"nwdara")
          forgetpassword.sendResetPassword(
            saveduser.fullName,
            saveduser.email,
            randomString
          );
          res.render("user/forgetPassword", {
            message: "Check your email to reset the password",
          });
        }
      } else {
        res.render("user/forgetPassword", {
          message: "User email is incorrect ",
        });
      }
    } catch (err) {
      next(err);
    }
  },
  resetPasswordpage: async (req, res, next) => {
    try {
      console.log(req.query.token, "quereytoken");
      const querytoken = req.query.token;
      const tokenData = await UserModel.findOne({ token: querytoken });

      console.log(tokenData, "value from usermodel");
      if (tokenData) {
        res.render("user/resetpassword", {
          user_id: tokenData._id,
          title: "resetpassword",
        });
      } else {
        res.render("user/404", { message: "token is invalid" });
      }
    } catch (err) {
      next(err);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const password = req.body.password;
      const user_id = req.body.user_id;
      const saltRounds = 10;
      const newPass = await bcrypt.hash(password, saltRounds);
      const updatedData = await UserModel.findByIdAndUpdate(
        { _id: user_id },
        { $set: { password: newPass, token: "" } },
        { new: true }
      );
      req.session.message = {
        type: "success",
        message: "User password has been reset",
      };

      res.redirect("/login");
    } catch (err) {
      next(err);
    }
  },

  getallProducts: async (req, res, next) => {
    try {
      let user = req.session.user;
      const id = req.params.id;
      const product = req.res;
      const category = await CategoryModel.find();

      res.render("user/shop", { user, product, category });
    } catch (err) {
      next(err);
    }
  },
  // getallProducts:async(req,res,next)=>{

  // try{
  //   const limitValue = req.query.limit || 8;
  //   const skipValue = req.query.skip || 0;
  //   const products = await ProductModel.find().countDocuments()
  //   const category = await CategoryModel.find();
  //   console.log(products);
  //   const product = await ProductModel.find()
  //   .limit(limitValue).skip(skipValue);

  //   res.render("user/shop", {product, category})

  // } catch (err) {
  //   next(err)
  // }

  // },

  //rendering productdetails page
  ProductPage: async (req, res, next) => {
    try {
      const id = req.params.id;
      //console.log(id);
      //const category = await CategoryModel.findOne({ _id: id });
      const product = await ProductModel.findOne({ _id: id }).populate(
        "category"
      );
      console.log(product);

      res.render("user/singleproduct", { product });
    } catch (err) {
      next(err);
    }
  },

  getCategory: async (req, res, next) => {
    try {
      const id = JSON.parse(JSON.stringify(req.body.id));
      console.log(id);
      const products = await ProductModel.find({ category: id }).populate(
        "category"
      );

      console.log(products);
      res.json(products);

      //const  productcategory=await ProductModel.findById({_id:nwid}).populate('category')
      //console.log(_id)
    } catch (err) {
      next(err);
    }
  },
  addtowishlist: async (req, res, next) => {
    try {
      let proId = req.params.id
      console.log(proId,"prrrrrrrrrrrooooooooooooo")
       let userId = req.session.user._id
      let product = await ProductModel.findById({_id:proId})
      console.log(product,"lllllllll")
      let prodObj = {
        productid: proId,
        price:product.price,
      }

      let userWishlist = await WishlistModel.findOne({ user: userId })
      if (userWishlist) {
        let itemIndex = userWishlist.products.findIndex((p) => p.productid == proId);

        if (itemIndex > -1) {
          res.json({ added: true })
        } else {
          //product does not exists in wishlist, add new item
          await WishlistModel.updateOne({ user: userId }, { $push: { products: prodObj } })
          res.json({ status: true })
        }

      } else {
        let wishObj = new WishlistModel({
          user: userId,
          products: [prodObj],
        })
        wishObj.save().then(() => {
          res.json({ status: true })
        })
      }
    } catch (error) {
      next(error);
    }
  },



  wishlistPage:async (req,res,next)=>{
    try{
      let user=req.session.user
      let id=user._id
      console.log(id)
      let wishlist=await WishlistModel.findOne({user:id}).populate('products.productid')
    console.log(wishlist,"uuu");
      res.render('user/wishlist',{user,wishlist})

    }catch(err){
      next(err)
    }

 },
 removeWishlist: async (req, res, next) => {
  try {
    let data = req.body
    console.log(data,"ggg")
    
    let product = await productModel.findOne({ _id:data.product })
    console.log(product,"data")
    let wishlistData = await WishlistModel.updateOne({ _id: data.wishlist }, { $pull: { products: { productid: data.product } } })
    console.log(wishlistData)
    if (wishlistData) {
      res.json({ removeProduct: true })
    }
  } catch (error) {
    next(error);
  }
},

  shoppingCartpage: async (req, res, next) => {
    try {
      const user = req.session.user;
      let user_id = req.session.user._id;
      let cart = await CartModel.findOne({ userId: user_id }).populate(
        "products.productid"
      );
      if (!cart) {
        cart = { products: [] };
      }

      res.render("user/shoppingcart", { user, cart ,message:req.session.message});
    } catch (err) {
      //console.log(error);
      next(err);
    }
  },

  //Add to Cart
  addtoCart: async (req, res, next) => {
    try {
      if (ajaxauth.verifyAjaxUser) {
        let user_id = req.session.user._id;
        let productId = req.query.id;
        //  console.log(productId,"passing value from ajax")
        let product = await ProductModel.findOne({ _id: productId });
        //console.log(product)
        let productObj = {
          productid: mongoose.Types.ObjectId(productId),
          quantity: 1,
          price: product.price,
        };

        let cartExist = await CartModel.findOne({ userId: user_id });
        if (cartExist) {
          let productExist = cartExist.products.findIndex(
            (p) => p.productid == productId
          );
          //console.log(productExist)
          if (productExist != -1) {
            const quantity = cartExist.products[productExist].quantity;
            await CartModel.updateOne(
              {
                userId: user_id,
                "products.productid": productId,
              },
              {
                $inc: {
                  "products.$.quantity": 1,
                  "products.$.price": product.price,
                  carttotal: product.price,
                },
              }
            );
            res.json("quantityincrease");
          } else {
            await CartModel.updateOne(
              { userId: user_id },
              {
                $push: { products: productObj },
                $inc: { carttotal: product.price },
              }
            );
            res.json("added");
          }
        } else {
          let productsInusercart = {
            userId: mongoose.Types.ObjectId(user_id),
            products: [productObj],
            carttotal: product.price,
          };
          let newcart = await CartModel.create(productsInusercart);
          //console.log(newcart,"this is new cart data")
        }
        // res.json({status:true,access:true})
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      next(err);
    }
  },
  changeQuantity: async (req, res, next) => {
    try {
      let totalAmount;
      let productprice;
      let cartdetails = req.body;

      console.log(req.body, "inside change quantity");
      let product = await ProductModel.findOne({ _id: cartdetails.product });
      console.log(product, "cartproduct");
      cartdetails.count = parseInt(cartdetails.count);
      cartdetails.quantity = parseInt(cartdetails.quantity);
      console.log(cartdetails.count);
      console.log(cartdetails.quantity);
      if (cartdetails.count === -1 && cartdetails.quantity === 1) {
        let data = await CartModel.findByIdAndUpdate(
          { _id: cartdetails.cart },
          {
            $pull: { products: { productid: cartdetails.product } },
            $inc: { carttotal: -product.price },
          },
          { new: true }
        );
        console.log(data, "dataaaa");
        totalAmount = data.carttotal;
        productprice = product.price;
        console.log(totalAmount, "amount");

        if (data) {
          res.json({ removeProduct: true, totalAmount, productprice });
        }
      } else {
        console.log("imentgfvb");
        const data = await CartModel.updateOne(
          {
            _id: cartdetails.cart,
            "products.productid": cartdetails.product,
          },

          {
            $inc: {
              "products.$.quantity": cartdetails.count,
              "products.$.price": product.price * cartdetails.count,
              carttotal: product.price * cartdetails.count,
            },
          }
        );
        let cartdata = await CartModel.findOne({ userId: cartdetails.user });

        let proExist = cartdata.products.findIndex(
          (p) => p.productid == cartdetails.product
        );
        let q = cartdata.products[proExist].quantity;
        totalAmount = cartdata.carttotal;
        console.log(totalAmount, "carttotal");
        productprice = product.price;
        console.log(totalAmount, "ttt");
        console.log(productprice, "pppp");
        console.log(q, "qqq");
        res.json({
          status: true,
          totalAmount,
          productprice,
          q,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  deletecartProduct: async (req, res, next) => {
    try {
      const cart = req.body.cartId;
      const productid = req.body.pdId;

      const price = req.body.price;
      console.log(cart + "CART ID");
      console.log(productid + "PRODUCTid");
      console.log(req.body.price);

      let data = await CartModel.findByIdAndUpdate(
        { _id: cart },
        {
          $pull: { products: { productid: productid } },
          $inc: { carttotal: -price },
        },
        { new: true }
      );
      console.log(data);
      res.json("deleted");
    } catch (err) {
      next(err);
    }
  },
  orderId: async (req, res, next) => {
    try {
      let cartId = req.body.cartId;
      // console.log(cartId +'cartid')
      let cartbill = await CartModel.findOne({ _id: cartId });
      console.log(cartbill);
      if (cartbill) {
        let product = {
          userId: cartbill.userId,
          billamount: cartbill.carttotal,
          products: cartbill.products,
          coupon: { discount: 0 },
        };
        let neworder = new orderModel(product);
        neworder.save().then((data) => {
          res.json(data);
        });
      }
    } catch (err) {
      next(err);
    }
  },
  checkoutPage: async (req, res, next) => {
    try {
      let user = req.session.user;
      let orderId = req.params.id;
      //console.log(orderId,"orderid")
      userid = req.session.user._id;
      //console.log(userid)
      let orderdetails = await orderModel
        .findOne({ _id: orderId })
        .populate("products.productid");
      console.log(orderdetails, "orderdetails");
      let userdetails = await UserModel.findOne({ _id: userid });
      //console.log(userdetails)

      res.render("user/checkout", { user, userdetails, orderdetails });
    } catch (err) {
      next(createError(404));
    }
  },
  applyCoupon: (req, res, next) => {
    try {
      let apiRes = {};
      //console.log(req.body.id +'ORDER ID');
      // console.log(req.body.coupon+'COUPON');
      //console.log(req.session.user._id+'user')
      if (req.body.coupon) {
        coupenModel
          .findOne({
            coupenCode: req.body.coupon,
            couponUser: { $nin: req.session.user._id },
          })
          .then((data) => {
            // console.log(data+"DATA________________________________________");
            if (data) {
              if (data.expirydate >= new Date()) {
                // console.log("inside expirydate if")
                orderModel
                  .findOne({
                    _id: req.body.id,
                    userId: req.session.user._id,
                    order_status: "pending",
                  })
                  .then((orderdetails) => {
                    if (orderdetails.billamount > data.minOrder) {
                      orderModel
                        .updateOne(
                          {
                            _id: req.body.id,
                            userId: req.session.user._id,
                            order_status: "pending",
                          },
                          {
                            $set: {
                              coupon: {
                                code: data.coupenCode,
                                discount: data.amount,
                              },
                            },
                          }
                        )
                        .then(() => {
                          // await coupenModel.updateOne({_id:data._id},{$addToSet:{couponUser:req.session.user._id}})
                          apiRes.coupon = data;
                          apiRes.message = "Applied coupon";
                          apiRes.success = true;
                          console.log("HELLO");
                          res.json(apiRes);
                        });
                    } else {
                      apiRes.message =
                        "This coupon cannot be used for this Amount";
                      res.json(apiRes);
                    }
                  });
              } else {
                // console.log("coupon expired");
                apiRes.message = "coupon expired";
                res.json(apiRes);
              }
            } else {
              //console.log("Invalid coupon ");
              apiRes.message = "Invalid coupon || This coupon already used";
              res.json(apiRes);
            }
          });
      } else {
        apiRes.message = "enter coupon code";
        res.json(apiRes);
      }
    } catch (err) {
      next(err);
    }
  },
  addNewaddress: async (req, res, next) => {
    try {
      const orderid = req.params.id;
      const id = req.session.user._id;
      console.log(id, "innnn");

      //console.log(idExist,"id exist")
      // console.log(req.body)
      let newaddress = {
        fullName: req.body.Name,
        house: req.body.House,
        post: req.body.post,
        district: req.body.district,
        pin: req.body.pin,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.Phone,
      };
      await UserModel.updateOne(
        { _id: id },
        { $push: { addressData: newaddress } }
      );
      console.log(newaddress);
      res.redirect("/checkout/" + orderid);
    } catch (err) {
      next(err);
    }
  },
  placeOrder: async (req, res, next) => {
    try {
      const user = req.session.user._id;
      console.log(req.body, "Data which is getting from form");

      const address = await UserModel.findOne({ _id: user });

      const order = await orderModel.findOne({
        _id: req.params.id,
        userId: req.session.user._id,
        order_status: "pending",
      }).populate('products.productid')
      const isStockAvailable = order.products.every((product) => {
        return product.quantity <= product.productid.stockvalue;
      });
      if (!isStockAvailable) {
        console.log(isStockAvailable, "+++-----");
        let outOfStockProducts = [];
        order.products.forEach((product) => {
          if (product.quantity > product.productid.stockvalue) {
            outOfStockProducts.push(product.productid.productName);
          }
        });
        
        req.session.message = {
          type: "danger",
          message: `${outOfStockProducts} is out of stock`,
        };
        res.json({ outOfStock: true });
      } else {
        console.log("out o asdfghj");
        order.products.forEach(async (product) => {
          console.log("out of stockkkkkkkk");
          new_stock = product.productid.stockvalue - product.quantity;
          await productModel.findByIdAndUpdate(
            { _id: product.productid._id },
            { $set: { stockvalue: new_stock } }
          );
        });

        address.addressData.forEach(async (add) => {
          if (add._id.toString() == req.body.address.toString()) {
            if (req.body.flexRadioDefault == "COD") {
              if (req.params.id) {
                //console.log(req.body.address+"address id")

                // const order = await orderModel.findOne({
                //   _id: req.params.id,
                //   userId: req.session.user._id,
                //   order_status: "pending",
                // });

                console.log(order, "order----------");
                if (order) {
                  orderModel
                    .updateOne(
                      { _id: req.params.id },
                      {
                        $set: {
                          addressData: {
                            fullName: add.fullName,
                            house: add.house,
                            post: add.post,
                            pin: add.pin,
                            city: add.city,
                            district: add.district,
                            state: add.state,
                          },
                          order_status: "completed",
                          "payment.payment_id": "COD_" + req.params.id,
                          "payment.payment_order_id": "COD_noOID",
                          "payment.payment_method": "cash_on_delivery",
                          "delivery_status.ordered.state": true,
                          "delivery_status.ordered.date": Date.now(),
                        },
                      }
                    )
                    .then(async () => {
                      await coupenModel.updateOne(
                        { coupenCode: "order.coupon.code" },
                        { $addToSet: { couponUser: req.session.user._id } }
                      );
                      await UserModel.updateOne(
                        { _id: req.session.user._id },
                        { $set: { cart: [] } }
                      );
                      res.json("COD");
                    });
                }

                // console.log(address+"ADRESSSSS________________");
                // console.log(req.params.id,"dfgh");
              }
            } else {
              if (req.params.id) {
                // console.log(req.params.id)
                // const order=await orderModel.findOne({_id:req.params.id,userId:req.session.user._id,order_status:"pending"})
                if (order) {
                  orderModel
                    .updateOne(
                      { _id: req.params.id },
                      {
                        $set: {
                          addressData: {
                            fullName: add.fullName,
                            house: add.house,
                            post: add.post,
                            pin: add.pin,
                            city: add.city,
                            district: add.district,
                            state: add.state,
                          },
                        },
                      }
                    )
                    .then(async () => {
                      await UserModel.updateOne(
                        { _id: req.session.user._id },
                        { $set: { cart: [] } }
                      );
                      console.log("inside then function ");
                      let total =(Math.round(order.billamount-(order.billamount*order.coupon.discount)/100))*100
                      console.log("sdfghj...................");
                      instance.orders
                        .create({
                          amount: total,
                          currency: "INR",
                          receipt: "" + order._id,
                        })
                        .then((order) => {
                          res.json({ field: order, key: process.env.KEY_ID });
                        });
                    })
                    .catch((err) => {
                      next(err);
                    });
                }
              }
            }
          }
        });
      }
    } catch (err) {
      next(err);
    }
  },
  verifypayment: (req, res, next) => {
    try {
      const response = JSON.parse(req.body.orders);
      console.log(response);
      let hamc = crypto.createHmac("sha256", process.env.KEY_SECRET);
      hamc.update(response.raz_oid + "|" + response.raz_id);
      hamc = hamc.digest("hex");
      if (hamc == response.raz_sign) {
        orderModel
          .updateOne(
            { _id: response.id },
            {
              $set: {
                order_status: "completed",
                "payment.payment_status": "completed",
                "payment.payment_id": response.raz_id,
                "payment.payment_order_id": response.raz_oid,
                "payment.payment_method": "Online_payment",
                "delivery_status.ordered.state": true,
                "delivery_status.ordered.date": Date.now(),
              },
            }
          )
          .then(() => {
            res.json("ONLINEPAYMENT");
          });
      } else {
        res.json("failed");
      }
    } catch (error) {
      next(error);
    }
  },

  orderDetails: async (req, res, next) => {
    try {
      let user = req.session.user;
      let id = user._id;
      const order = await orderModel
        .find({ userId: user._id, order_status: "completed" })
        .sort({ ordered_date: -1 })
        .populate("products.productid");

      res.render("user/orderdetails", { user, order });
    } catch (err) {
      next(err);
    }
  },

  viewOrder: async (req, res, next) => {
    try {
      const user = req.session.user;
      const id = req.params.id;

      const orderData = await orderModel
        .findById({ _id: id })
        .populate("products.productid");
      console.log(orderData, "orderdata------------------");

      res.render("user/vieworder", { user, orderData });
    } catch (err) {
      next(err);
    }
  },

  getuserProfile: async (req, res, next) => {
    try {
      const users = req.session.user._id;

      let user = await UserModel.findOne({ _id: users });
      console.log(user);
      //console.log(user,"awsedrftghjnkm")
      res.render("user/userprofile", { user });
    } catch (err) {
      next(err);
    }
  },

  addAddress: async (req, res, next) => {
    try {
      const id = req.params.id;
      //console.log(id);

      const idExist = await UserModel.findOne({ _id: id });
      //console.log(idExist,"id exist")
      // console.log(req.body)
      let newaddress = {
        fullName: req.body.Name,
        house: req.body.House,
        post: req.body.post,
        district: req.body.district,
        pin: req.body.pin,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.Phone,
      };
      await UserModel.updateOne(
        { _id: id },
        { $push: { addressData: newaddress } }
      );
      res.redirect("/userprofile");
    } catch (err) {
      next(err);
    }
  },
  editAddress: async (req, res, next) => {
    try {
      const user = req.session.user;
      //console.log(user)
      const addId = req.body.id;
      //console.log(addId)
      let useraddress = await UserModel.findOne({ _id: user._id });

      useraddress.addressData.forEach(function (val) {
        if (val.id.toString() == addId.toString()) {
          console.log(val);
          res.json(val);
        }
      });
    } catch (err) {
      next(err);
    }
  },
  updateAddress: async (req, res, next) => {
    const user = req.session.user;

    try {
      let newaddressupdate = {
        "addressData.$.fullName": req.body.Name,
        "addressData.$.house": req.body.House,
        "addressData.$.post": req.body.post,
        "addressData.$.city": req.body.city,
        "addressData.$.district": req.body.district,
        "addressData.$.state": req.body.state,
        "addressData.$.pin": req.body.pin,
        "addressData.$.phone": req.body.Phone,
      };
      console.log(newaddressupdate);
      await UserModel.updateOne(
        { _id: user._id, "addressData._id": req.params.id },
        { $set: newaddressupdate }
      ).then(() => {
        res.redirect("/userprofile");
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  deleteAddress: async (req, res, next) => {
    try {
      const id = req.session.user._id;
      console.log(id);
      console.log(req.body.id + "address id");
      await UserModel.updateOne(
        { _id: id },
        { $pull: { addressData: { _id: req.body.id } } }
      );
      res.json("deleted");
    } catch (err) {
      next(err);
    }
  },

  aboutPage: (req, res) => {
    try {
      let user = req.session.user;
      res.render("user/about", { user });
    } catch (err) {
      next(err);
    }
  },
  contactPage: (req, res) => {
    try {
      let user = req.session.user;
      res.render("user/contact", { user });
    } catch (err) {
      next(err);
    }
  },

  cancelOrder: (req, res) => {
    try {
      const id = req.body.id;
      console.log(id);
      orderModel
        .updateOne(
          { _id: id },
          {
            $set: {
              order_status: "cancelled",
              "delivery_status.cancelled.state": true,
              "delivery_status.cancelled.date": Date.now(),
            },
          }
        )
        .then(() => {
          res.json("Ordercanceled");
        });
    } catch (err) {
      next(err);
    }
  },

  Logout: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
};
