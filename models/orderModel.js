import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    totalAmount : {
        type : Number,
        required : true,
        min : 0
    },
    
    status : {
        type : String,
        enum : ["placed", "processing", "shipped", "delivered", "cancelled"],
        default : "placed"
    }
},
    {
        timestamps: true,
        collection : "orders"
    }

)
const Order = mongoose.model("Order", orderSchema)
export default Order