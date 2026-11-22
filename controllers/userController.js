import User from "../models/userModel.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

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

const login = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body

        const result = await User.findOne({email})
                                    .select("+passwordHash")

        if (!result) {
            return res.status(401).json({
                message : "Invalid email or password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, result.passwordHash)
        if(!isPasswordCorrect) {
            return res.status(401).json({
                message : "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                userId : result._id,
                role : result.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn : "1h"
            }
        )

        res.status(200).json({
            message : "login successful",
            token : token
        })



    } catch (error) {
      next(error)  
    }
}

const myProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const user = await User.findById(userId)
        return res.status(200).json({
            userInfo : {
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                phone : user.phone
            }
        })
    } catch (error) {
        next(error)
    }
}

const allUsers = async (req, res, next) => {
    try {

        const allUsers = await User.find()
        const totalUser = await User.countDocuments()
        
        return res.status(200).json({
            totalUser : totalUser,
            allUsers
        })
    } catch (error) {
        next(error)
    }
}

export { register, login, myProfile, allUsers }