import { TaskModel } from "../models/taskModel.js";

const calculatePriority = (due_date) => {
    const today = new Date()
    const dueDate = new Date(due_date)

    const day_difference = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
    if (day_difference === 0) {
        return 0
    }
    if (day_difference <= 2) {
        return 1
    }
    if (day_difference <= 4) {
        return 2
    }
    if (day_difference >= 5) {
        return 3
    }
}

export const createTask = async (req, res) => {
    try {
        const { title, description, due_date} = req.body
        const user_id = req.user_id
        const newTask = await TaskModel.create({
            title,
            description,
            due_date,
            priority: calculatePriority(due_date),
            user_id
        })
        if (newTask) {
            return res.status(201).json({
                status: "Success",
                message: "Task created successfully",
                task: newTask
            })
        } else {
            return res.status(401).json({
                status: "Fail",
                message: "Failed to create new task"
            })
        }
    } catch (err) {
        console.log("An error in encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getAllTask = async (req, res) => {
    try {
        const user_id = req.user_id
        const tasks = await TaskModel.find({ user_id: user_id })
        if (tasks) {
            return res.status(201).json({
                status: "Success",
                message: "All tasks fetched successully",
                Tasks: tasks
            })
        } else {
            return res.status(401).json({
                success: "Fail",
                message: "No task found"
            })
        }
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const updateTask = async (req, res) => {
    try {
        const { due_date, status } = req.body
        const { taskID } = req.params
        const task = await TaskModel.findById(taskID)
        if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
            return res.status(401).json({
                message: "Invalid status value"
            })
        }
        const priority = calculatePriority(due_date)
        task.due_date = due_date || task.due_date
        task.status = status || task.status
        task.priority = priority || task.priority
        await task.save()
        return res.status(201).json({
            status: "Success",
            message: "Task updated successfully",
            Task: updateTask
        })
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { taskID } = req.params
        const task = await TaskModel.findByIdAndDelete(taskID)
        if (task) {
            return res.status(401).json({
                status: "Fail",
                message: "Task not deleted"
            })
        } else {
            return res.status(201).json({
                status: "Success",
                message: "Task deleted successfully"
            })
        }
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}