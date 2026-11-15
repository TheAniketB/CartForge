
import { body, param } from "express-validator";

export const createProductValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage("Product name must be between 3 and 100 characters"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .bail()
        .isLength({ min: 10, max: 1000 })
        .withMessage("Description must be between 10 and 1000 characters"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .bail()
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("brand")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Brand cannot exceed 50 characters"),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .bail()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),

    body("images")
        .isArray({ min: 1 })
        .withMessage("At least one product image is required"),

    body("images.*.url")
        .trim()
        .notEmpty()
        .withMessage("Image URL is required")
        .bail()
        .isURL({ protocols: ["http", "https"], require_protocol: true })
        .withMessage("Invalid image URL"),

    body("images.*.publicId")
        .trim()
        .notEmpty()
        .withMessage("Image public ID is required"),

    body("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean")
];

export const productIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid product ID")
];
