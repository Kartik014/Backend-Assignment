import mongoose from "mongoose";

const schema = mongoose.Schema

const taskSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    due_date: Date,
    priority: Number,
    status: {
        type: String,
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        default: "TODO"
    },
    user_id:{
        type: String,
        required: true
    }
})

export const TaskModel = mongoose.model("Task", taskSchema, "Task")