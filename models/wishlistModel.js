const mongoose = require("mongoose");
const Objectid = mongoose.Types.ObjectId;

const wishlistSchema = new mongoose.Schema({


    user:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'userData'
    },
    products:[
        {
            productid:{
                type:mongoose.Schema.Types.ObjectId , 
                required:true,
                ref:"products"
          },
        }
    ]


});
module.exports = WishlistModel = mongoose.model("whishlist", wishlistSchema);
