import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "firstName is required"],
        trim : true,
        maxLength : [ 30, "firstName cannot be greater the 30 characters" ],
        minLength : [ 1, "firstName should have atleast 1 character "]
    },
    lastName : {
        type : String,
        required : [true, "lastName is required"],
        trim : true,
        maxLength : [ 30, "lastName cannot be greater the 30 characters" ],
        minLength : [ 1, "lastName should have atleast 1 character "]
    },
    email : {
        type : String,
        required : [ true, "email is required" ],
        match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email"
        ],
        trim : true,
        unique : true,
        lowercase : true
    },
    passwordHash : {
        type : String,
        required : true,
        select : false
    },
    phone : {
        type : String,
        trim : true
    },
    role : {
        type : String,
        enum : ["user", "admin"],
        default : "user"
    },
    isActive : {
        type : Boolean,
        default : true
    },
}, {
    timestamps : true,
    collection : "users"
}

)

const User = mongoose.model("User", userSchema)

export default User;