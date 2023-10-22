const mongoose = require("mongoose")

const favouritePropSchema = new mongoose.Schema({
    user_id :{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    property_id :{
        type: mongoose.Schema.ObjectId,
        ref: "Property",
        required: true,
    },
      updated_at: {
        type: Date,
        default: Date.now,
      }

})





const FavouriteProp = mongoose.model("FavouriteProp", favouritePropSchema);

module.exports = FavouriteProp;
