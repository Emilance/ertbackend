const Property = require("../models/Property")
const Tour = require("../models/Tour")
const User = require("../models/User")






const getAnalytics  = async (req, res )  => {

    try {
        const landLordCount = await User.countDocuments({role: "landlord"})
        const studentCount = await User.countDocuments({role: "student"})
        const propertyCount = await Property.countDocuments()
        const tourCount  = await Tour.countDocuments()
        
      
        res.status(200).json({
            landLordCount, studentCount, propertyCount, tourCount
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to get analytcis data", message: error.message });
    }
}





module.exports = {getAnalytics}