const UserModel=require('../models/userModel')
module.exports={
    verifyAjaxUser:(req,res,next)=>{
        if(req.session.user){
            next()
        }else{
            console.log("ELSE AJAX");
            res.json('loginfirst')
        }
    }
}