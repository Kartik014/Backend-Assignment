import mongoose from "mongoose";

const schema = mongoose.Schema

const userSchema = new schema({
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    }
})

export const UserModel = mongoose.model("User", userSchema, "User")