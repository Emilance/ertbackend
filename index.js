const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

require("dotenv").config();



const app = express();
app.use(cors());

const server = require("http").createServer(app)

 const io = new Server(server,  
  {
    cors:{
      origin:"*",
      credentials : true
    } 
  }
  );

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
        io.to(user.socketId).emit("userTyping", user)
    }
 })

 socket.on("stop-typing", (userd) => {
  let user = onlineUser.find(user => user.userId === userd.recipientId)
  if(user){
      io.to(user.socketId).emit("userStopTyping", user)
  }

})


  socket.on("disconnect", ()=> {
      onlineUser = onlineUser.filter(user => user.socketId !== socket.id)
 
      io.emit("getOnlineUser", onlineUser)

  })

});

  module.exports = {io}

app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const PORT = 5000 || process.env.PORT;

//import routes
const userRoute = require("./routes/userRoutes").router
const propertyRoute = require("./routes/propertyRoutes").router
const notificationRoute = require("./routes/notificationRoutes").router
const OTPRoute = require("./routes/EditOTPRoutes").router
const tourRoute = require("./routes/tourRoutes").router
const paymentRoute = require("./routes/paymentRoutes").router
const ForgetPassword = require("./routes/forgetPasswordRoutes").router
const chatRoutes =  require("./routes/ChatRoutes").router
const messageRoutes =  require("./routes/MessagesRoutes").router




const compression = require('compression');
const User = require("./models/User");
const Property = require("./models/Property");
const Tour = require("./models/Tour");
const Notification = require("./models/Notification");
app.use(compression());



//Routes
app.use("/apis/users",  userRoute) ;
app.use("/apis/properties",  propertyRoute) ;
app.use("/apis/notifications",  notificationRoute) ;
app.use("/apis/otps",  OTPRoute) ;
app.use("/apis/tours",  tourRoute) ;
app.use("/apis/payments", paymentRoute)
app.use("/apis/forgetpassword", ForgetPassword)
app.use("/apis/chats", chatRoutes)
app.use("/apis/messages", messageRoutes)







const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`EasyRent backend listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("An Error Occur " + e.message);
    console.log(MONGO_URI);
  });

app.get("/", async (req, res) => {
//   const user = await User.create({
//     role:'admin',
//     email: " afolabidave9@gmail.com",
//     password: "afolabi"
//  })
  res.send("api is  working perfectly");
});


app.get("/:email", async (req, res) => {
   const {email} = req.params
   console.log(email)
   const user = await User.find({email}) 
   if(!user ||  user.length <= 0  ){
    res.send("No User Found with this email");
    return
   }
   const id = user[0]?._id
   console.log(id, user)
  try {
      const properties = await Property.find({owner : id})
    properties.map( async (data, index) => {
      console.log(data.id)
        await Property.findByIdAndDelete(data.id)

    })
    const tours = await Tour.find({ userId : id })
    tours.map( async (data, index) => {
      console.log(data.id)
        await Tour.findByIdAndDelete(data.id)

    })

    const not = await Notification.find({user_id  : id})
    not.map( async (data, index) => {
      console.log(data.id)
        await Notification.findByIdAndDelete(data.id)
    })

     await User.findByIdAndDelete(id)
    res.send("Account deleted with houses and  tours attached")

  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message})
  }

});
