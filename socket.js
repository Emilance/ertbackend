// const { Server } = require("socket.io");
// require("dotenv").config();

const { io } = require("./index");


// // const io = new Server(({cors: process.env.CLIENT_URL}));



let onlineUser= []

io.on("connection", (socket) => {
 
    console.log("new connection" , socket.id)
    
    //listen to connection
  
    socket.on("addNewUser", (userId) => {
     !onlineUser.some(user => user.userId === userId)  &&
        onlineUser.push({
        userId,
        socketId: socket.id
       }) 
        console.log(onlineUser)
        io.emit("getOnlineUser", onlineUser)
    })

     //send medssage
     socket.on("sendMessage", (message) => {
        const user = onlineUser.find(user => user.userId === message.recipientId)
        if(user){
            io.to(user.socketId).emit("getMessage", message)
        }
    })


    //typing effect 
    socket.on("typing", (userd) => {
      let user = onlineUser.find(user => user.userId === userd.recipientId)
      
      if(user){
        console.log("typing", user)
          io.to(user.socketId).emit("userTyping", user)
      }
   })

   socket.on("stop-typing", (userd) => {
    let user = onlineUser.find(user => user.userId === userd.recipientId)
     console.log("stop styping", user)
    if(user){
        io.to(user.socketId).emit("userStopTyping", user)
    }

})


    socket.on("disconnect", ()=> {
        onlineUser = onlineUser.filter(user => user.socketId !== socket.id)
   
        io.emit("getOnlineUser", onlineUser)

    })

});



// io.listen(4000, (token) => {
//   if (!token) {
//     console.warn("port already in use");
//   }else{
//     console.log("connected successfully")
//   }
// });