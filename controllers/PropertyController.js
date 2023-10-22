const Property = require("../models/Property");
const { validateBody } = require("../utils/utilityFunctions");
const { cloudinary } = require("../utils/cloudinary");
const Notification = require("../models/Notification");


// Import the Property model (assuming you have a "Property" model defined).

// Define a controller function for creating a property
const createProperty = async (req, res) => {
  // Validate the incoming request using Express Validator
  if (validateBody(req, res)) {
    return;
  }

  // Extract data from the request
  const { apartment, amount, images, location, about, features, mainFeatures } = req.body;

  // Save images to Cloudinary and get their links
  const imageUrls = [];
 // Assuming "images" is a field in your form for file uploads

  if (images && images.length > 0) {
    for (const image of images) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, (err, result)=>{
        if (err) {
          return res.status(500).json({ message: "Image upload failed" , err});
        }
      });
      imageUrls.push(cloudinaryResponse.secure_url);
    }
  }

  // Create a new Property instance
  const newProperty = new Property({
    apartment,
    images: imageUrls, // Store Cloudinary image links
    amount,
    location,
    about,
    features,
    mainFeatures,
    owner : req.user.user_id
  });

  // Create a new Date object to get the current date and time
const currentDate = new Date();

// Get the year, month, and day
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
const day = currentDate.getDate();

// Create formatted strings for the date
const formattedDate = `${day}-${month < 10 ? '0' : ''}${month}-${year}`;


  //Notification Content
  const notificationContent = {
    heading : "Property Created Sucesss",
    content : `A new ${apartment} was added to your  apartment list  on  ${formattedDate}`,
    user_id : req.user.user_id,
    attachment : newProperty._id,
    Date : formattedDate
    
  }

  // Save the property to the database
  try {
    await newProperty.save();
    const newNotification = await Notification.create(notificationContent)
    return res.status(201).json({ message: "Property created successfully", property: newProperty });
  } catch (error) {
    return res.status(500).json({ message: "Error creating the property",  error : error.message });
  }
};



const showMyProperty = async (req, res)=> {

    const user = req.user 

    try {
        const  properties = await Property.find({ owner: user.user_id })
        if(!properties){
            return res.status(404).json({message:"property  not found"})
        }
        res.status(200).json( properties )
    } catch (error) {
        return res.status(500).json({ message: "Error fetching property",  error : error.message });
    }
}



const showSingleProperty = async (req, res)=> {
  const propertyId = req.params.id  
  try {
      const  properties = await Property.findById(propertyId)
      if(!properties){
          return res.status(404).json({message:"property  not found"})
      }

      res.status(200).json( properties )
  } catch (error) {
      return res.status(500).json({ message: "Error fetching property",  error : error.message });
  }
}


const deleteProperty = async (req, res) => {
  const   propertyId = req.params.id;
  try {
       const deletedProperty = await  Property.findByIdAndDelete(propertyId)
       if(!deletedProperty) {
          res.status(404).json({message :"Property not found"})
       }
       res.status(200).json({message : "Property deleted successfully"})
  } catch (error) {
     return res.status(500).json({ message: "Fail to delete",  error : error.message });
  }
}


module.exports = { createProperty ,showMyProperty , showSingleProperty , deleteProperty};
