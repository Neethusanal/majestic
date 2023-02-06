const mongoose= require('mongoose')

const coupenSchema= new mongoose.Schema({

    coupenCode:{
        type:String,
        required:true,
        unique:true,
        set:value=>value.toLowerCase()
    },
    status:{
        type:Boolean,
        required:true
    },amount:{
        type:Number,
        required:true
    },
    minOrder:{
        type:Number,
        required:true
    },
    expirydate:{
        type:Date,
        default:Date
    } ,couponUser:[
        mongoose.Schema.Types.ObjectId
    ]

})
module.exports = CoupenModel=mongoose.model('coupen',coupenSchema)