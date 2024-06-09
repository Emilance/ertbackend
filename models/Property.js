const mongoose = require("mongoose")

const propertySchema = new mongoose.Schema({
    apartment:{
        type:String,
        required: true,
        trim : true
    },
    images :[
        {
            type:String
        }
    ],
    amount: {
        type: Number
    },
    location:{
        type:String,
    },
    about:{
        type:String
    },
    bedroom : {
        type: Number,
        default:0,
    },
    hostelName :{
        type: String,
        default:'',
    },
    features:[String],
    mainFeatures:{
        light: Boolean,
        school :Boolean,
        carPack: Boolean
    },
    owner :{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    status :{
        type:String,
        enum:["free", "occupied"],
        default: "free"
    },
    propertyStatus:{
       type : String ,
       enum :["accepted" , "rejected" ,  "pending" ] ,
       default: 'pending'
       
    },
    created_at: {
        type: Date,
        default: Date.now,
      },
    updated_at: {
    type: Date,
    default: Date.now,
    }

})





const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
