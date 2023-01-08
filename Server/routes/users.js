const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT } = require("../middlewares");

const {
    emailExist,
    userExistByID,
    careerExistByName,
} = require("../helpers/db-validators");

const {
    usersGet,
    usersPost,
    usersPatch,
    usersDelete,
} = require("../controllers/users");

const router = Router();

router.get("/", usersGet);

router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("name", "Name must be at least 3 characters").isLength({ min: 3 }),
        check("email", "Invalid email").isEmail(),
        check("email").custom(emailExist),
        check("password", "The password must have more than 6 letters").isLength({
            min: 6,
        }),
        check("career").custom(careerExistByName),
        validateFields,
    ],
    usersPost
);

router.delete(
    "/:id",
    [
        validateJWT,
        check("id", "Invalid Mongo ID").isMongoId(),
        check("id").custom(userExistByID),
        validateFields,
    ],
    usersDelete
);

router.patch("/:id",
    [
        validateJWT,
        check("id", "Invalid Mongo ID").isMongoId(),
        check("id").custom(userExistByID),
        validateFields,
    ], usersPatch
);

module.exports = router;
