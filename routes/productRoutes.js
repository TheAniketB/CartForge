import { addProducts, displayProducts, getProductByName, getProductByNameOrCategory, getProducts } from "../controllers/productController.js"

import express from "express"
import { createProductValidator } from "../validators/product.validator.js"
import { validate } from "../middlewares/validate.middleware.js"
const router = express.Router()

router.get("/", getProducts)
router.post("/", createProductValidator, validate, addProducts)
router.get("/search", getProductByNameOrCategory)
router.get("/:name", getProductByName)





export default router
