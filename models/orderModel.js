const mongoose= require('mongoose')

const orderSchema= new mongoose.Schema({

userId:{
    type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'userData'
    },  

    addressData:{
        fullName:{
            type:String,
            require:true
        },
       
        house:{
            type:String,
            require:true
        },
       
        post:{
            type:String,
            require:true
        },
        district:{
            type:String,
            require:true
        },
        city:{
            type:String,
            require:true
        },
        pin:{
            type:Number,
            require:true
        },
        state:{
            type:String,
            require:true 
        },
        phone:{
            type:Number,
            require:true 
        }
},
billamount: {
    type:Number, 
    required:true
},
order_status:
{type:String, 
    default:'pending'
},
payment:{
    payment_method: {type:String},
    payment_id:{type:String},
    payment_order_id:{type:String},
    payment_status:{type:String, default:'pending'},
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
delivery_status:{
    cancelled:{state:{type:Boolean,default:false},
    date:{type:Date},

    },
    ordered:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    },
    shipped:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    }, 
    out_for_delivery:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    },
    delivered:{
        state:{type:Boolean, default:false},
        date:{type:Date},
    },
},
coupon:{
    
    code:{type:String},
    discount:{type:Number}
},
ordered_date: {type:Date, default: Date.now(), index:true}, 
    


})
module.exports = OrderModel=mongoose.model('order',orderSchema)