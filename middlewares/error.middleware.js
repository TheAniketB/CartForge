export const errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }
    console.log(error)
    // console.log(error.email.ValidatorError);
    

    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];

        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
            field
        });
    }

    res.status(500).json({
        message : "Internal Server Error"
    })
}