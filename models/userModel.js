const mongoose=require('mongoose')
const userSchema=  new mongoose.Schema({

    fullName:{
        type:String,
        required:true

    },
    userName:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
     status:{
         type:Boolean,
        default:'true'
     },
   
      token:{
         type:String,
        default:''
     },
     addressData:[{
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
}]
    
  
})
module.exports=UserModel= mongoose.model('userData',userSchema)
