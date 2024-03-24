const mongoose = require("mongoose")



const messageSchema = new mongoose.Schema({
   chatId : {
    type: String,
    required: true
   },
   senderId: {
    type: String,
    required: true
   },
   text : {
    type: String,
    required: true
   },
   attachment: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    default: null
   },
   property: {
    type: mongoose.Schema.ObjectId,
    ref: "Property",
    default: null
   }
},
{
    timestamps: true
}
)





const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
