const mongoose = require("mongoose");
const Objectid = mongoose.Types.ObjectId;

const wishlistSchema = new mongoose.Schema({


    user:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'userData'
    },
    product:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        }
    ]


});
module.exports = WishlistModel = mongoose.model("whishlist", wishlistSchema);
