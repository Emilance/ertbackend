const multer = require("multer")



// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload