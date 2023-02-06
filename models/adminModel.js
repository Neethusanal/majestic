const mongoose= require('mongoose')

const adminSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true

    },
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

})
module.exports = AdminModel=mongoose.model('admin',adminSchema)