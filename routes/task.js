import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { createTask, deleteTask, getAllTask, updateTask } from "../controllers/task.js";

const router = express.Router()

router.post("/create-task", authenticateUser, createTask);
router.get("/get-tasks", authenticateUser, getAllTask);
router.put("/update-task:taskID", authenticateUser, updateTask);
router.delete("/delete-task:taskID", authenticateUser, deleteTask);

export default router