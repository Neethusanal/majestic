const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("./configuration/connection");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const session=require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const bodyparser=require('body-parser')
const multer=require('multer')
const createError = require('http-errors')
var sanitizer = require('sanitize')();
require("dotenv").config();




// For creating an instance of the express module
const app = express();
//CACHE CONTROL
app.use(function (req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});






//For setting EJS as the template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middleware to deal with incoming data from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());
// app.use(session({secret:'key',cookie:{maxAge:600}}))


//Enabling express-session :)
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret:'secret-key',
    saveUninitialized:true,
    cookie:{maxAge: oneDay},
    resave:false}))






app.use("/admin", adminRouter);
app.use("/", userRouter);

// app.use(function (req, res, next) {
//     next(createError(404));
//   });
  
//   // error handler
//   app.use(function (err, req, res, next) {
//     console.log(err,"define error");
//     // set locals, only providing error in development
//    // // console.log(err);
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//   ///// console.log(res.locals.message);
//     // render the error page
//     res.status(err.status || 500);
//     res.render('Error/404')
//     // res.send('dont worry u will gt..');
// });

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  if (err.status == 404) {
   
      res.render("Error/404", { error: err.message });
    
  } else {
   
      res.render("Error/404", { error: "server down" });
    
  }
});

// // Port number the server will run on
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"));

module.exports = app;
