const mongoose = require("mongoose");
const Objectid = mongoose.Types.ObjectId;

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
   
    type:mongoose.Types.ObjectId,
    required: true,
    ref: "category",
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: [{
    type: String,
    required: true,
  }],
  instock: {
    type: Boolean,
    
    required: true,
  },
  stockvalue:{
    type: Number,
    required:true,
  }
});
module.exports = ProductModel = mongoose.model("products", productSchema);
