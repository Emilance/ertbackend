const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");



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

  const PORT = process.env.PORT  || 5000;



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

module.exports = { app, server, io };
