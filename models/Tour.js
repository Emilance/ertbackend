const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema({
    day:{
        type:String,
        required: true,
        trim : true
    },
    time: {
        type: Number,
        required: true,

    },
    period:{
        type: String
    },
    userId :{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    propertyId :{
        type: mongoose.Schema.ObjectId,
        ref: "Property",
        required: true,
    },
    paid: {
        type:Boolean,
        default : false
    },
    created_at: {
        type: Date,
        default: Date.now,
      },
    updated_at: {
    type: Date,
    default: Date.now,
    }

})





const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
