//mongodb connection
require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://neethukumarkk:neethu@cluster0.eaabzwo.mongodb.net/majesticbakery',{ useNewUrlParser:true, 
useUnifiedTopology:true}, () => {
  console.log(" mongoose database connected");
});
mongoose.set('strictQuery',true);
