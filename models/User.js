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
  phoneNumber:{
    type: Number,
    default: 0
  },
  role:{
    type: String,
    enum:["landlord", "student", "admin" ],
    required:true
  },
  admin: {
    level: { type: Number, default: 1, min: 1, max: 3 }
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
  lastTour :{
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    default: null
  },
  oauth : {
    type: Boolean,
    default: false
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
