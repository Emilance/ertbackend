
const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
   members: [{
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
   }],
   unreadMessageCount: {
    type:Number,
    default: 0
   }
},
{
    timestamps: true
}
)





const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
