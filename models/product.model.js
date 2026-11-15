import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            unique : true,
            trim: true,
            minlength: [3, "Product name must be at least 3 characters"],
            maxlength: [100, "Product name cannot exceed 100 characters"]
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters"],
            maxlength: [1000, "Description cannot exceed 1000 characters"]
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [1, "Price must be at least 1"],
            validate: {
                validator: Number.isFinite,
                message: "Price must be a valid number"
            }
        },

        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true,
            lowercase : true
        },

        brand: {
            type: String,
            trim: true,
            maxlength: [50, "Brand cannot exceed 50 characters"]
        },

        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Stock must be a whole number"
            }
        },

        images: [
            {
                url: {
                    type: String,
                    required: [true, "Image URL is required"],
                    trim: true,
                    match: [
                        /^https?:\/\/.+/i,
                        "Please provide a valid HTTP or HTTPS image URL"
                    ]
                },

                publicId: {
                    type: String,
                    required: [true, "Image public ID is required"],
                    trim: true
                }
            }
        ],

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
