import express from "express"
import { login, myProfile, register } from "../controllers/userController.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { validateUserInfo } from "../validators/user.validator.js"
import { validate } from "../middlewares/validate.middleware.js"

const router = express.Router()

router.post("/register", validateUserInfo, validate, register)
router.post("/login", login)
router.get("/myprofile", authenticate, myProfile)

export default router