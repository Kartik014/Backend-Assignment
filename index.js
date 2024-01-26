import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: './Database/config.env' });
import task from "./routes/task.js";
import subTask from "./routes/subtask.js";
import user from "./routes/user.js";

export const app = express()
app.use(express.json())
app.use(cors())

app.use("/task", task)
app.use("/subTask", subTask)
app.use("/user", user)

app.get('/', (req, res) => {
    res.send("Hello !!")
})