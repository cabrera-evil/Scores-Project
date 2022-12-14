const cloudinary = require("cloudinary").v2;

// Delete an image from cloudinary using his public_id
async function deleteFile(public_id) {
    try {
        return await cloudinary.uploader.destroy(public_id);
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = { deleteFile };