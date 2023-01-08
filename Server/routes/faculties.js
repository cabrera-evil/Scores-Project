const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields, validateJWT } = require("../middlewares");

const { facultyExistByID } = require("../helpers/db-validators");

const {
    facultyGet,
    facultyPost,
    facultyPatch,
    facultyDelete,
} = require("../controllers/faculties");

const router = Router();

router.get("/", facultyGet);

router.post(
    "/",
    [
        validateJWT,
        check("name", "Name is required").not().isEmpty(),
        check("name", "Name must be at least 3 characters").isLength({ min: 3 }),
        // Careers validations
        check("careers", "Careers is required").not().isEmpty(),
        check("careers", "Careers must be an array").isArray(),
        check("careers.*.name", "Career name is required").not().isEmpty(),
        // Subjects validations
        check("careers.*.subjects", "Subjects must be an array").isArray(),
        check("careers.*.subjects.*.name", "Subject name is required").not().isEmpty(),
        check("careers.*.subjects.*.uv", "Subject UV is required").not().isEmpty(),
        check("careers.*.subjects.*.uv", "Subject UV must be a number").isNumeric(),
        validateFields,
    ],
    facultyPost
);

router.delete(
    "/:id",
    [
        validateJWT,
        validateFields,
    ],
    facultyDelete
);

router.patch("/:id",
    [
        validateJWT,
        check("id", "Invalid Mongo ID").isMongoId(),
        check("id").custom(facultyExistByID),
        validateFields,
    ], facultyPatch
);

module.exports = router;