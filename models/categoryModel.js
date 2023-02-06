const mongoose= require('mongoose')

const categorySchema= new mongoose.Schema({

    categoryName:{
        type:String,
        required:true,
        unique:[true,'Already Exist'],
        set:value=>value.toLowerCase()
    
    },

    deleted:{
        type:Boolean,
        default:false
    }
    

})
module.exports = CategoryModel=mongoose.model('category',categorySchema)