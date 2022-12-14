const dbValidators = require("./db-validators");
const generateJWT = require("./generate-jwt");
const uploadFile = require("./upload-file");
const deleteFile = require("./delete-file");

module.exports = {
    // se expanden los contenidos
    ...dbValidators,
    ...generateJWT,
    ...uploadFile,
    ...deleteFile
};