import jwt from "jsonwebtoken"

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                message : "authentication is required"
            })
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(400).json({
                message : error.name === "TokenExpiredError"
                ? "token has expired please login again"
                : "Invalid authentication token"
            })
        }
        next(error)
    }
}