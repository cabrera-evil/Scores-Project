const { Router } = require("express");
const { check } = require("express-validator");

// Import middlewares
const { login, validateToken, renewToken } = require("../controllers/auth");
const { validateFields, validateJWT } = require("../middlewares");

const router = Router();

// Login
router.post(
    "/login",
    [
        check("email", "Email is required").isEmail(),
        check("password", "Password is required").not().isEmpty(),
        validateFields,
    ],
    login
);

// Validate token
router.get("/validate/:token", validateToken)

// Renew token
router.get("/", validateJWT, renewToken);

module.exports = router;
