import express from "express"
import { allUsers, login, myProfile, register } from "../controllers/userController.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { validateUserInfo } from "../validators/user.validator.js"
import { validate } from "../middlewares/validate.middleware.js"
import { authorize } from "../middlewares/authorize.middleware.js"

const router = express.Router()

router.post("/register", validateUserInfo, validate, register)
router.post("/login", login)
router.get("/myprofile", authenticate, myProfile)
router.get("/allusers", authenticate, authorize("admin"), allUsers)


export default router