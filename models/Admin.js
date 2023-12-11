const { default: mongoose } = require("mongoose");




const AdminSchema = mongoose.Schema({
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
    role:{
      type: String,
      enum:["landlord", "student", "admin" ],
      required:true
    },
    password:{
      type:String,
      required: true,
      trim: true
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