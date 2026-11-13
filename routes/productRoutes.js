import { displayProducts } from "../controllers/productController.js"

import express from "express"
const router = express.Router()

router.get("/", displayProducts)





export default router
