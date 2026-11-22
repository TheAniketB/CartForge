import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    order : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Order"
    },
    product : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Product"
    },
    quantity : {
        type : Number,
        required : true,
        min : [1, "there should should be atleast one item of the product"]
    },
    price : {
        type : Number,
        required: true,
        min : [0, "price cannot be a negative number"]
    }
},
{
    timestamps: true,
    collection: "orderItems"
})

const OrderItem = mongoose.model("OrderItem", orderItemSchema )
export default OrderItem