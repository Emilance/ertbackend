const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    heading:{
        type:String,
    },
    content:{
        type:String,
        required:true
    },
    user_id :{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    picture :{
        type: String,

    },

    attachment :{
        type: mongoose.Schema.ObjectId,
        ref: "Property",
    },
    created_at: {
        type: Date,
        default: Date.now,
      },
    Date: {
        type: String,
        required:true
    }
})





const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
