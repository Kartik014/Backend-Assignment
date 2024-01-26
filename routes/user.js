import express from "express";
import { createUser, logIn } from "../controllers/user.js";

const router = express.Router()

router.post("/create-user", createUser);
router.post("/login", logIn);

export default router