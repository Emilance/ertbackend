const { io } = require("./init");

let onlineUser = [];

io.on("connection", (socket) => {
    // console.log("new connection", socket.id);

    // Listen to connection
    socket.on("addNewUser", (userId) => {
        !onlineUser.some((user) => user.userId === userId) &&
            onlineUser.push({
                userId,
                socketId: socket.id,
            });
       
        
        io.emit("getOnlineUser", onlineUser);
        notifyUserUpdated();
    });

    // Send message
    socket.on("sendMessage", (message) => {
        const user = onlineUser.find((user) => user.userId === message.recipientId);
        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    // Typing effect
    socket.on("typing", (userd) => {
        let user = onlineUser.find((user) => user.userId === userd.recipientId);

        if (user) {
            io.to(user.socketId).emit("userTyping", user);
        }
    });

    socket.on("stop-typing", (userd) => {
        let user = onlineUser.find((user) => user.userId === userd.recipientId);
        if (user) {
            io.to(user.socketId).emit("userStopTyping", user);
        }
    });

    socket.on("disconnect", () => {
        onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUser", onlineUser);
        notifyUserUpdated();
    });
});

function notifyUserUpdated() {
   // console.log("User list updated:", onlineUser);
    if (typeof onUserUpdatedCallback === "function") {
        onUserUpdatedCallback(onlineUser);
    }
}

let onUserUpdatedCallback;

function setOnUserUpdatedCallback(callback) {
    onUserUpdatedCallback = callback;
}

module.exports = { onlineUser, setOnUserUpdatedCallback };
