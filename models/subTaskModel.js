import mongoose from "mongoose";

const schema = mongoose.Schema

const subTaskSchema = new schema({
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: Date,
    deleted_at: Date
})

export const SubTaskmodel = mongoose.model("Sub_Task", subTaskSchema, "Sub_Task")