import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Order from "../models/orderModel.js";
import OrderItem from "../models/orderItemModel.js";
const createOrder = async (req, res, next) => {
    let session;
    try {
        // console.log("1. createOrder controller started");
        if (!req.user || !mongoose.isValidObjectId(req.user.userId)) {
            return res.status(401).json({
                message : "invalid user authentication"
            })
        }

        const { userId } = req.user
        const { items } = req.body
        // console.log("2. User and items extracted");

        session = await mongoose.startSession()
        session.startTransaction()
        // console.log("3. Transaction started");

        const orderItems = []
        let totalAmount = 0

        for (const item of items) {
            // console.log("4. Fetching product:", item.productId);
            const product = await Product.findById(
                item.productId).session(session)

            // console.log("5. Product lookup completed");

            if (!product) {
                const error = new Error(
                    `product with Id ${item.productId} does not exist`)
                error.statusCode = 404
                throw error   
            }
            if (product.stock < item.quantity) {
                const error = new Error(
                    `Insufficient stock for ${product.name}`
                )
                error.statusCode = 409
                throw error
            }

            const unitPrice = Number(product.price)
            totalAmount += unitPrice * item.quantity

            orderItems.push({
                productId : product._id,
                quantity : item.quantity,
                unit_price : unitPrice
            })
        }
        totalAmount = Number(totalAmount.toFixed(2))

        const [order] = await Order.create(
            [{
                user : userId,
                totalAmount
            }],
            {session}
        )

        for (const item of orderItems) {
            const stockResult = await Product.updateOne(
                {
                    _id : item.productId,
                    stock : { $gte : item.quantity}
                },
                {
                    $inc : { stock : -item.quantity}
                },
                { session }
            )

            if (stockResult.modifiedCount !== 1) {
                const error = new Error(
                    `unable to deduct stock for product with productId ${item.productId}`
                )
                error.statusCode = 409
                throw error
            
            }  
        }

        const orderItemDocuments = orderItems.map( item => ({
            order : order._id,
            product : item.productId,
            quantity : item.quantity,
            price : item.unit_price

        }))

        await OrderItem.insertMany(
            orderItemDocuments,
            {session}
        )
        await session.commitTransaction()
        return res.status(201).json({
            message : "order placed successfully",
            order,
            items : orderItems
        })
        
    } catch (error) {
        console.error("ORDER ERROR:", error);
        if (session?.inTransaction()) {
            await session.abortTransaction()   
        }
        next(error)

    } finally {
        if (session) {
            await session.endSession()
            
        }
    }
}

const getMyOrders = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // Step 1: Fetch logged-in user's orders
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        if (orders.length === 0) {
            return res.status(200).json({
                message: "You haven't placed any orders yet",
                orders: []
            });
        }

        // Step 2: Extract all order IDs
        const orderIds = orders.map(order => order._id);

        // Step 3: Fetch all corresponding order items
        const orderItems = await OrderItem.find({
            order: { $in: orderIds }
        })
            .populate("product", "name")
            .lean();

        // Step 4: Group order items by order ID
        const itemsByOrder = new Map();

        for (const item of orderItems) {
            const orderId = item.order.toString();

            if (!itemsByOrder.has(orderId)) {
                itemsByOrder.set(orderId, []);
            }

            itemsByOrder.get(orderId).push({
                product: item.product,
                quantity: item.quantity,
                price: item.price
            });
        }

        // Step 5: Attach items to their respective orders
        const result = orders.map(order => ({
            ...order,
            items: itemsByOrder.get(order._id.toString()) || []
        }));

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders: result
        });

    } catch (error) {
        next(error);
    }
};

export {createOrder, getMyOrders}