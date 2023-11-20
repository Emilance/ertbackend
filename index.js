const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
const PORT = 5000 || process.env.PORT;
//import routes
const userRoute = require("./routes/userRoutes").router
const propertyRoute = require("./routes/propertyRoutes").router
const notificationRoute = require("./routes/notificationRoutes").router
const OTPRoute = require("./routes/EditOTPRoutes").router
const tourRoute = require("./routes/tourRoutes").router

const compression = require('compression');
app.use(compression());



//Routes
app.use("/apis/users",  userRoute) ;
app.use("/apis/properties",  propertyRoute) ;
app.use("/apis/notifications",  notificationRoute) ;
app.use("/apis/otps",  OTPRoute) ;
app.use("/apis/tours",  tourRoute) ;





const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`EasyRent backend listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("An Error Occur " + e.message);
    console.log(MONGO_URI);
  });

app.get("/", (req, res) => {
  res.send("api is  working perfectly");
});
