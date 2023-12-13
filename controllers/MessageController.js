const Message = require("../models/Messsage")





const  createMessage = async (req, res) => {
    const {chatId  , text} = req.body
    const senderId = req.user.user_id

try {
    const message = await Message.create({
        chatId, 
        senderId,
         text
    })
    res.status(201).json({message :" message sent successfully",  data : message})
} catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Failed to  createChat", message: error.message });
}
 
    
}




const findChatMessages = async (req, res ) => {
    const {chatId} = req.params
    try {
        const messages = await Message.find({chatId})
        if(!messages || messages  <= 0){
            return res.status(404).json({
                message : "No Message in found for this chat"
            })
        }

        res.status(200).json(messages)

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "fail to fetch chat messages ",
             message : error.message
        })
    }
}


module.exports = {createMessage, findChatMessages}
