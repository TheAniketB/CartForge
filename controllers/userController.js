import User from "../models/userModel.js"
import bcrypt from "bcrypt";

const register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            phone
        } = req.body

        const passwordHash = await bcrypt.hash(password, 10)
        const result = await User.create({
            firstName,
            lastName,
            email,
            passwordHash,
            phone
        })
        res.status(201).json({
            message : "user registered successfully",
            UserInfo: {
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                phone: result.phone,
                role: result.role
            }
        })
    } catch (error) {
        next(error)
    }
}

export { register }