import { configDotenv } from "dotenv"
configDotenv()

import express from "express"
import { errorHandler } from "./middlewares/errorMiddleware.js"
import productRoutes from "./routes/productRoutes.js"
import connectDB from "./config/db.js"


const PORT = 3000
const app = express()
app.use(express.json())


app.use("/products", productRoutes)


app.use(errorHandler)

async function startServer() {
    try {
        await connectDB()
        console.log("Connected to mongoDB successfully");

        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
            
        })
        

    } catch (error) {
        console.error("couldn't connect to database");
        
    }
}
startServer()