const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
      type: String,
      trim: true
  }, 
  lastName :{
      type: String,
      trim:true
  },
  gender :{
    type:String
  },
  email : {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  emailVerified:{
    type: Boolean,
    default: false
  },
  role:{
    type: String,
    enum:["landlord", "student" ],
    required:true
  },
  password:{
    type:String,
    required: true,
    trim: true
  },
  bankDetails :{
    bankName : String,
    acctName : String,
    acctNumber : Number 
  },
  profilePicture :{
    type: String
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },



})


const User = mongoose.model("User", userSchema);

module.exports = User;
