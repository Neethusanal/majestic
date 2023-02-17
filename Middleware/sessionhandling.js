const UserModel=require('../models/userModel')
const flash = require('connect-flash');
module.exports = {
    // userSession:async (req, res, next) => {
    //     if (req.session.user) {
    
    //             next()
    //     }
    //     else {

    //         res.redirect('/login')
    //     }
    // },
    adminSession:async (req, res, next) => {
        if (req.session.doLogin) {
            
              next(); 
        }
        else {
            
            res.redirect('/admin')
        }
    },


    userSession: async (req, res, next) => {
        let user = req.session.user;
        if (user) {
            let userId = user._id;
            let userṣ = await UserModel.findById({ _id: userId });
            if ( userṣ.status === true) {
                next()
            }else {
                console.log("INSIDE else");
                // res.redirect('/login') 
                res.render('user/login',{status:false , message:"Admin has banned your account "})
            }
        } else {
        
            res.redirect('/login')
        }
    },
};