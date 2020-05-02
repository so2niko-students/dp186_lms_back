import cloudinary = require('cloudinary');

const cd = cloudinary.v2;

cd.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export {cd};

