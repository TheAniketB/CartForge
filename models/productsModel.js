const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },

    description : {
        type : String,
        required : true
    },

    price : {
        type : Number,
        required : true,
        min : 1
    },

    category : {
        type : String,
        required : true
    },

    brand : {
        type : String
    },

    stock : {
        type : Number,
        required : true,
        min : 0,
        default : 0
    },

    // images	Array	Valid image URLs
    images : [
        {
            url : {
                type : String,
                required : true
            },

            publicId : {
                type : String,
                required : true
            }
        }
    ],

    isActive : {
        type : Boolean,
        default : true
    },
},
    // createdAt	Date	Automatic
    // updatedAt	Date	Automatic
    {
        timestamps : true
    }

)