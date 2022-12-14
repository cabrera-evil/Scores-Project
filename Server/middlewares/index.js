const validateFields = require("../middlewares/validate-fields");
const validateJWT = require("../middlewares/validate-jwt");
const validateFileToUpload = require("../middlewares/validate-file");

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateFileToUpload,
};
