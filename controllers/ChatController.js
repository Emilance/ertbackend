const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Messsage");
const { onlineUser , setOnUserUpdatedCallback} = require("../socket");



 var userIdsArray = []


// setOnUserUpdatedCallback((updatedUserList) => {
//     // Access the updated user list here
//      userIdsArray = updatedUserList.map(user => user.userId);
    
//     console.log("Received updated user list:", userIdsArray);
// });



// const createChat = async (req, res) => {
//     const userId = req.user.user_id;
//     try {
//         // Get a random admin user
//         const adminRecipient = await User.aggregate([
//             { $match: { role: "admin" } },
//             { $sample: { size: 1 } },
//         ]);
//          console.log(adminRecipient)
//         if (!adminRecipient || adminRecipient.length === 0) {
//             return res.status(404).json({ error: "No admin user found" });
//         }

//         const recipId = adminRecipient[0]._id;
//         if(userId == recipId)  return res.status(400).json({message: " cannot create a chat with yourself"})
//         // const existingChat = await Chat.findOne({
//         //     members: { $all: [userId, recipId] },
//         // });

//         const existingChat = await Chat.find({
//             members: { $in: [userId] },
//         });
//         console.log(existingChat)
//         if (existingChat.length > 0 ) {
//             return res.status(200).json(existingChat);
//         }
       
//         const newChat = await Chat.create({
//             members: [userId, recipId],
//         });

//         return res.status(201).json(newChat);
//     } catch (error) {
//         console.log(error);
//         return res
//             .status(500)
//             .json({ error: "Failed to createChat", message: error.message });
//     }
// };



const createChat = async (req, res) => {
    const userId = req.user.user_id;
    try {
        // Check for existing chat
        const existingChat = await Chat.find({ members: { $in: [userId] }, status: 'active' });
        console.log(existingChat);
        if (existingChat.length > 0) {
            return res.status(200).json(existingChat);
        }



        // Set callback for updated user list
        setOnUserUpdatedCallback((updatedUserList) => {
            // Access the updated user list here
            userIdsArray = updatedUserList.map(user => user.userId);
            console.log("Received updated user list:", userIdsArray);
        });

        let adminRecipientId ;
        let adminRecipient =[] ;

       
        // Filter online admin users
        const onlineAdmins = userIdsArray.filter(id => isAdmin(id)   && id != userId); //  isAdmin(userId) is a function that checks if the user is an admin
        console.log('onlineadmins',  onlineAdmins)
        // if (onlineAdmins.length > 0) {
        //     // Randomly select an online admin recipient
        //      adminRecipientId = onlineAdmins[Math.floor(Math.random() * onlineAdmins.length)];
        //     console.log("Randomly selected online admin recipient:", adminRecipientId);
        // } else {
        //     // No online admin users available, fallback to selecting any admin user randomly
        //      adminRecipient = await User.aggregate([
        //         { $match: { role: "admin" } },
        //         { $sample: { size: 1 } },
        //     ]);
        //     console.log("Randomly selected admin recipient:", adminRecipient);
        // }
        adminRecipient = await User.aggregate([
            { $match: { role: "admin" } },
            { $sample: { size: 1 } },
        ]);
        console.log("Randomly selected admin recipient:", adminRecipient);


        // Check if the recipient ID is the same as the sender's ID
        const recipId = adminRecipientId || adminRecipient[0]?._id;
        
        if (userId == recipId) {
            return res.status(400).json({ message: "Cannot create a chat with yourself" });
        }

       
        // Create new chat
        const newChat = await Chat.create({ members: [userId, recipId] });
        const myLastTour =await  User.findById(userId).select('lastTour')
        if(myLastTour){
            const message = await Message.create({
                chatId : newChat._id,
                senderId :userId,
                 text : 'New Tour' ,
                 attachment: myLastTour.lastTour
                 
            })
        }


        return res.status(201).json(newChat);

    } catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({ error: "Failed to create chat", message: error.message });
    }
};

// Function to check if the user is an admin
async function isAdmin(id) {
    try {
        // Find the user by ID
        const user = await User.findById(id);
         
        // Check if the user exists and has the admin role
        if (user && user.role === "admin") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}




// Function to check if the user is an admin
async function isAdmin(userId) {
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists and has the admin role
        if (user && user.role === "admin") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}





const findUserChats = async (req, res) => {
    const userId = req.user.user_id;
    try {
        // Find all chats where the current user is a member
        const chats = await Chat.find({
            members: { $in: [userId] },
            status: "active"
        });

        // Populate the other user's details in each chat
        const populatedChats = await Chat.populate(chats, {
            path: 'members',
            select: '-password', // Exclude the password field
            match: { _id: { $ne: userId } }, // Exclude the current user from the population
        });
        populatedChats.reverse()
        res.status(200).json(populatedChats);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get Chat", message: error.message });
    }
};

const updateUnreadMessageCount  = async (req, res ) => {
    const chatId = req.params.chatId
    const {unreadMessageCount} = req.body
    try {
        const  updatedChat = await Chat.findByIdAndUpdate(chatId, { $inc: { unreadMessageCount: unreadMessageCount } });
        res.status(200).json(updatedChat)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to update Chat", message: error.message });
    }

}


const findChats = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.user_id;
    try {
        // Find the chat by ID
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        // Populate the members field and exclude the current user
        const populatedChat = await Chat.populate(chat, {
            path: 'members',
            select: '-password', // Exclude the password field
            match: { _id: { $ne: userId } }, // Exclude the current user from the population
        });

        res.status(200).json(populatedChat);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get Chat", message: error.message });
    }
};



const regenerateChat = async(req, res) =>{
    const { chatId } = req.params;
    const {user_id}   = req.user
        console.log("getting here ")
    try {
         // Find the chat by ID
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      // Create the last closed Message
        await Message.create({
            chatId, 
            senderId : user_id,
            text : "✅ ✅ ✅ Chat Closed ✅ ✅ ✅  ",
        })
  
      // Update and close the chat
      await Chat.findByIdAndUpdate(chatId, {status: "closed"});

      await  createChat(req, res)
    } catch (error) {
       console.log(error)  
    }
}


const closeChat = async (req, res) => {
    const { chatId } = req.params;
    const {user_id}   = req.user_id

     try {
      // Find the chat by ID
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      // Create the last closed Message
        await Message.create({
            chatId, 
            senderId : user_id,
            text : "✅ ✅ ✅ Chat Closed ✅ ✅ ✅  ",
        })
  
      // Update and close the chat
      await Chat.findByIdAndUpdate(chatId, {status: "closed"});
  
      return res.status(200).json({ message: 'Chat closed successfully' });
    } catch (error) {
      console.error('Error closing chat:', error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}


const destroyChat = async (req, res) => {
    const { chatId } = req.params;
  
    try {
      // Find the chat by ID
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      // Delete all messages associated with the chat
      await Message.deleteMany({ chatId });
  
      // Delete the chat
      await Chat.findByIdAndDelete(chatId);
  
      return res.status(200).json({ message: 'Chat and associated messages deleted successfully' });
    } catch (error) {
      console.error('Error deleting chat:', error);
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  };


  


module.exports = {createChat, regenerateChat, destroyChat, closeChat, updateUnreadMessageCount, findUserChats, findChats}