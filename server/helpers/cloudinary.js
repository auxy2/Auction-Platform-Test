const cloudinary =  require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

const { CLOUDINARY_NAME, CLOUDINARY_KEY,  CLOUDINARY_SECRETE } = process.env;
cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_KEY, 
    api_secret: CLOUDINARY_SECRETE // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary


