const mongoose = require('mongoose');
const Objectid = mongoose.Types.ObjectId
const bannerSchema = new mongoose.Schema({
    bannerName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    image: [{
        type: String,
        required: true
    }],
    status: {
        type: Boolean,
        default: true
    }


})

module.exports = BannerModel = mongoose.model('Banner', bannerSchema);