import { SubTaskmodel } from "../models/subTaskModel.js";
import { TaskModel } from "../models/taskModel.js";

export const createSubTask = async (req, res) => {
    try {
        const { task_id } = req.body
        if (!task_id) {
            return res.status(401).json({
                status: "Fail",
                message: "Task id not found"
            })
        }
        const newSubTask = await SubTaskmodel.create({
            task_id
        })
        if (newSubTask) {
            return res.status(201).json({
                status: "Success",
                message: "Sub task created successfully",
                sub_task: newSubTask
            })
        } else {
            return res.status(401).json({
                status: "Fail",
                message: "Failed to create sub task"
            })
        }
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getAllSubTask = async (req, res) => {
    try {
        const user_id = req.user_id
        const task = await TaskModel.find({ user_id: user_id })
        const subTasksMap = await Promise.all(
            task.map(async (task) => {
                const subTask = await SubTaskmodel.find({ task_id: task._id })
                return { task, subTask }
            })
        )
        if (subTasksMap) {
            return res.status(201).json({
                status: "Success",
                message: "All sub tasks fetched successfully",
                sub_tasks: subTasksMap
            })
        } else {
            return res.status(401).json({
                status: "Fail",
                message: "No sub task was found"
            })
        }
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const updateSubTask = async (req, res) => {
    try {
        const { status } = req.body
        const { subTaskID } = req.params
        let counter = 0
        console.log(subTaskID)
        if (![0, 1].includes(status)) {
            return res.status(401).json({
                status: "Fail",
                message: "Incorrect status value"
            })
        }
        const subTask = await SubTaskmodel.findById(subTaskID)
        if (!subTask) {
            return res.status(401).json({
                status: "Fail",
                message: "Sub Task not found"
            })
        }
        const today = Date.now()
        subTask.status = status || subTask.status
        subTask.updated_at = today || subTask.updated_at
        await subTask.save()
        const totalSubTasks = await SubTaskmodel.find({ task_id: subTask.task_id })
        const task = await TaskModel.findById(subTask.task_id)
        for (let i = 0; i < totalSubTasks.length; i++) {
            if (totalSubTasks[i].status === 1) {
                counter++
            }
            if (counter === totalSubTasks.length) {
                task.status = "DONE"
            } else if (counter >= 1) {
                task.status = "IN_PROGRESS"
            }
        }
        await task.save()
        return res.status(201).json({
            status: "Success",
            message: "Sub Task updated successfully",
            Task: subTask
        })
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteSubTask = async (req, res) => {
    try {
        const { subTaskID } = req.params
        const subTask = await SubTaskmodel.findByIdAndDelete(subTaskID)
        if (subTask) {
            return res.status(201).json({
                status: "Success",
                message: "Sub task deleted successfully"
            })
        } else {
            return res.status(401).json({
                status: "Fail",
                message: "Failed to delete sub task"
            })
        }
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}