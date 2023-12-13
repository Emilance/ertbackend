const Chat = require("../models/Chat");
const User = require("../models/User");




const createChat = async (req, res) => {
    const userId = req.user.user_id;
    try {
        // Get a random admin user
        const adminRecipient = await User.aggregate([
            { $match: { role: "admin" } },
            { $sample: { size: 1 } },
        ]);
         console.log(adminRecipient)
        if (!adminRecipient || adminRecipient.length === 0) {
            return res.status(404).json({ error: "No admin user found" });
        }

        const recipId = adminRecipient[0]._id;
        if(userId == recipId)  return res.status(400).json({message: " cannot create a chat with yourself"})
        const existingChat = await Chat.findOne({
            members: { $all: [userId, recipId] },
        });

        if (existingChat) return res.status(200).json(existingChat);

        const newChat = await Chat.create({
            members: [userId, recipId],
        });

        return res.status(201).json(newChat);
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Failed to createChat", message: error.message });
    }
};



const findUserChats = async (req, res) => {
    const userId = req.user.user_id;
    try {
        // Find all chats where the current user is a member
        const chats = await Chat.find({
            members: { $in: [userId] },
        });

        // Populate the other user's details in each chat
        const populatedChats = await Chat.populate(chats, {
            path: 'members',
            select: '-password', // Exclude the password field
            match: { _id: { $ne: userId } }, // Exclude the current user from the population
        });

        res.status(200).json(populatedChats);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get Chat", message: error.message });
    }
};



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


module.exports = {createChat,  findUserChats, findChats}