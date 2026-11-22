
import { body, validationResult } from "express-validator";

const validateOrder = [
    body("items")
        .isArray({ min: 1 })
        .withMessage("Order must contain at least one item"),

    body("items.*.productId")
        .isMongoId()
        .withMessage("Please provide a valid product ID")
        .bail()
        .trim(),

    body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer")
        .toInt(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const items = req.body.items;
        const productIds = new Set();

        for (const item of items) {
            const productId = item.productId.toLowerCase();

            if (productIds.has(productId)) {
                return res.status(400).json({
                    message: "Duplicate productIds are not allowed"
                });
            }

            productIds.add(productId);
        }

        next();
    }
];

export default validateOrder;
