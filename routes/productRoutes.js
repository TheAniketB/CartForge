import { addProducts, displayProducts, getProducts } from "../controllers/productController.js"

import express from "express"
import { createProductValidator } from "../validators/product.validator.js"
import { validate } from "../middlewares/validate.middleware.js"
const router = express.Router()

router.get("/", getProducts)
router.post("/", createProductValidator, validate, addProducts)



export default router
