const bodyParser = require("body-parser");
const { app } = require("./init");

require("dotenv").config();


 















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
const analyticsRoutes =  require("./routes/AnalyticsRoutes").router




const compression = require('compression');
const User = require("./models/User");
const Property = require("./models/Property");
const Tour = require("./models/Tour");
const Notification = require("./models/Notification");
const Chat = require("./models/Chat");
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
app.use("/apis/analytics", analyticsRoutes)







  const bcrypt = require("bcrypt");


app.get("/", async (req, res) => {

//   const encryptedPassword = await bcrypt.hash("afolabi23", 10)

//   const user = await User.create({
//     role:'admin',
//     email: " afolabidave9@gmail.com",
//     password: encryptedPassword,
//     firstName :" David",
//     lastName : " afolabi"
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
      console.log(data._id)
        await Property.findByIdAndDelete(data._id)

    })
    const tours = await Tour.find({ userId : id })
    tours.map( async (data, index) => {
      console.log(data.id)
        await Tour.findByIdAndDelete(data._id)

    })

    const not = await Notification.find({user_id  : id})
    not.map( async (data, index) => {
      console.log(data._id)
        await Notification.findByIdAndDelete(data._id)
    })
    const chats = await Chat.find({
      members: { $in: [id] },
  });
chats.map( async (data, index) => {
      console.log(data.id)
        await Chat.findByIdAndDelete(data._id)
    })


     await User.findByIdAndDelete(id)
    res.send("Account deleted with houses and  tours attached")

  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message})
  }

});
