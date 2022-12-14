const { response } = require("express");

// Validate it there's an image to upload
const validateFileToUpload = (req, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).send({ msg: "No files were uploaded." });
  }
  next();
};

module.exports = {
  validateFileToUpload,
};
