const mongoose= require('mongoose')

const cartSchema= new mongoose.Schema({

userId:{
    type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'userData'
    },  
products:[
    {    
        productid:{
              type:mongoose.Schema.Types.ObjectId , 
              required:true,
              ref:"products"
        },

       
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        }
       


    }
],
carttotal:{
    type:Number,
    default:0
},
active:{

type:Boolean,
default:true

},


})
module.exports = CartModel=mongoose.model('cart',cartSchema)