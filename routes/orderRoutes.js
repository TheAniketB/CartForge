import express from "express"
import validateOrder from "../validators/order.validator.js"
import {createOrder, getMyOrders} from "../controllers/orderController.js"
import { authenticate } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/", authenticate, validateOrder, createOrder)
router.get("/my-orders", authenticate, getMyOrders)

export default router