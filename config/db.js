import mongoose from "mongoose"

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.error("mongodb connection failed", error.message);
        throw error
        
    }
}

export default connectDB