const cloudinary = require("cloudinary").v2;

// Upload an image to cloudinary
async function uploadFile(fielPath, type) {
  try {
    return await cloudinary.uploader.upload(fielPath, {
      folder: `prettygirl-api/${type}`,
    })
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { uploadFile };