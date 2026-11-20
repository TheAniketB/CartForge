import Product from "../models/product.model.js";

const displayProducts = async (req, res, next) => {
    try {
        const result = await Product.find()
                                .select("-__v -createdAt -updatedAt");

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const { 
            category,
            page = "1",
            limit = "5",
            sortBy = "price",
            order = "desc"
        } = req.query

        const allowedQueryParams = [
            "category", 
            "page",
            "limit",
            "sortBy",
            "order"
        ]
        const unknownParams = Object.keys(req.query)
                                        .filter(
                                            param => !allowedQueryParams.includes(param)
                                        )
        
        if (unknownParams.length > 0) {
            return res.status(400).json({
                message : "unknown query paramters",
                invalid : unknownParams
            })
        }

        const pageNumber = Number(page)
        const pageSize = Number(limit)

        if(!Number.isInteger(pageNumber) || pageNumber < 1
            || !Number.isInteger(pageSize) || pageSize < 1) {
                return res.status(400).json({
                    message : "page and limit must be a positive number"
                })

        }

        //filter category
        //sort by name, price, category
        const allowedSortedFields = [
            "name",
            "price",
            "category"
        ]
        if (!allowedSortedFields.includes(sortBy)) {
            return res.status(400).json({
                message : "invalid Sort Field"
            })
        }
        if (!["asc", "desc"].includes(order)) {
            return res.status(400).json({
                message : "order can only have asc or desc as values"
            })
        }

        const filter = {};

    if (category) {
        const escapedCategory = category.trim().replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
    
        filter.category = {
            $regex: `^${escapedCategory}$`,
            $options: "i"
        };
    }

        const skip = (pageNumber - 1) * pageSize

        const sortOrder = order === "asc" ? 1 : -1

        const result = await Product.find(filter)
                                    .sort({ [sortBy] : sortOrder })
                                    .skip(skip)
                                    .limit(pageSize)
                                    .select("-__v -createdAt -updatedAt")

                
        const productCount = await Product.countDocuments(filter);

        const totalPages = Math.ceil(productCount / pageSize)

        if(pageNumber > totalPages) {
            return res.status(200).json({
                "success": true,
                "currentPage": pageNumber,
                "totalPages": totalPages,
                "limit":pageSize,
                "totalProducts": productCount,
                "result": result
            })
        }

        res.status(200).json({
            currentPage : pageNumber,
            totalPages : totalPages ,
            limit : pageSize,
            totalProduct : productCount,
            result
        })

    } catch (error) {
        next(error)
    }
    
}

const addProducts = async (req, res, next) => {
    try {
        const {
            name,
            description,
            price,
            category,
            brand,
            stock,
            images,
            isActive
        } = req.body

        const result = await Product.create({
            name,
            description,
            price,
            category,
            brand,
            stock,
            images,
            isActive
        })
        res.status(201).json({
            message : "Product added successfully",
            product : result
        })
    } catch (error) {
        next(error)
    }
    
}


const getProductByName = async (req, res, next) => {
    try {
        const { name } = req.params;

        if (!name?.trim()) {
            return res.status(400).json({
                message: "Please provide a product name"
            });
        }

        const escapedName = name.trim().replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        const result = await Product.find({
            name: {
                $regex: escapedName,
                $options: "i"
            }
        });

        if (result.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Products found successfully",
            result
        });

    } catch (error) {
        next(error);
    }
};


const getProductByNameOrCategory = async (req, res, next) => {
    try {
        const { name, category } = req.query
        if (!name?.trim() && !category?.trim()) {
            return res.status(400).json({
                message: "Please provide a name or category"
            });
        }
        const queryParameters = {}
        if (name?.trim()) {
            const escapedName = name.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            )

            queryParameters.name = {
                $regex: escapedName,
                $options: "i"
            };
        }

        if (category?.trim()) {
            const escapedName = category.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            )

            queryParameters.category = {
                $regex : escapedName,
                $options : "i"
            }
        }

        const result = await Product.find(queryParameters)
        if (result.length === 0) {
            return res.status(404).json({
                message : "product not found"
            }) 
        }
        res.status(200).json({
            message : "Product/s found successfully",
            result
        })
    } catch (error) {
        next(error)
    }
    
}

const editProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        const allowedFields = [
            "name",
            "description",
            "price",
            "stock",
            "images"
        ]
        
        const updates = {}

        for (const field of allowedFields) {
            if(req.body[field] !== undefined) {
                updates[field] = req.body[field]
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({
                message : "please provide aleast one valid field"
            })
        }

        const result = await Product.findByIdAndUpdate(
            { _id : id },
            { $set : updates},
            {
                new : true,
                runValidators : true
            }
        )

        if (!result) {
            return res.status(404).json({
                message : "product not found"
            })
        }

        res.status(200).json({
            message : "product updated successfully",
            result : result
        })
        
    } catch (error) {
        next(error)
    }
    
}

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params

        const result = await Product.findByIdAndDelete(id)

        if (!result) {
            return res.status(404).json({
                messasge : "product not found"
            })    
        }

        res.status(200).json({
            message : "Product deleted successfully",
            deletedItem : result
        })
    } catch (error) {
        next(error)
    }
}

export { 
    displayProducts, 
    addProducts, 
    getProducts, 
    getProductByName,
    getProductByNameOrCategory,
    editProduct,
    deleteProduct
};
