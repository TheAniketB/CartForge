import { body, param } from "express-validator";

export
 const validateUserInfo = [
    body("firstName")
        .isString()
        .withMessage("firsName should be a string")
        .notEmpty()
        .withMessage("firstName is required")
        .bail()
        .trim()
        .isLength({min:1, max:30})
        .withMessage("firstName should be between 1 and 30 characters"),
    
    body("lastName")
        .isString()
        .withMessage("lastName should be a string")
        .notEmpty()
        .withMessage("lastName is required")
        .bail()
        .trim()
        .isLength({min:1, max:30})
        .withMessage("lastName should be between 1 and 30 characters"),

    body("email")
        .isEmail()
        .withMessage("please enter a valid email"),

]