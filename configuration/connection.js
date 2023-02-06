//mongodb connection

const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/majesticbakery",{ useNewUrlParser:true, 
useUnifiedTopology:true}, () => {
  console.log(" mongoose database connected");
});
mongoose.set('strictQuery',true);
