
import Product from "../models/productsModel.js";

const displayProducts = async (req, res, next) => {
    try {
        const result = await Product.find();

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export { displayProducts };
