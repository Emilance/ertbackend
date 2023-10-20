const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your cloud name, API key, and API secret          
cloudinary.config({ 
  cloud_name: 'ddkcysmgy', 
  api_key: '988262881387172', 
  api_secret: 'zqO4bdqmnvqnRIcvLZCNCq10w0w' 
});


module.exports = {cloudinary}