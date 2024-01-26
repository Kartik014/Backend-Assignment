import express from "express";
import { createSubTask, deleteSubTask, getAllSubTask, updateSubTask } from "../controllers/subTask.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/create-subTask", authenticateUser, createSubTask);
router.get("/getAll-subTask", authenticateUser, getAllSubTask);
router.put("/update-subTask/:subTaskID", authenticateUser, updateSubTask);
router.delete("/delete-subTask/:subTaskID", authenticateUser, deleteSubTask);

export default router