import { UserModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import schedule from "node-schedule";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: "./Database/config.env" });

const generateToken = (user_id) => {
    const secretKey = process.env.SECRET_KEY
    const payload = {
        user_id: user_id
    }
    const options = {
        expiresIn: "1h"
    }
    const token = jwt.sign(payload, secretKey, options)
    return token
}

export const createUser = async (req, res) => {
    try {
        const { phone_number, email, password } = req.body
        const hashedpwd = await bcrypt.hash(password, 10)
        const newUser = await UserModel.create({
            phone_number,
            email,
            password: hashedpwd
        })
        if (newUser) {
            return res.status(201).json({
                satus: "Success",
                message: "User registered successfully",
                user: newUser
            })
        } else {
            return res.status(401).json({
                satus: "Fail",
                message: "User failed to register",
                user: newUser
            })
        }
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.status(401).json({
                status: "Fail",
                message: "User not found"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "Fail",
                message: "Incorrect password"
            })
        }
        const token = generateToken(user._id)
        if (!token) {
            return res.status(401).json({
                status: "Fail",
                message: "Failed to generate token"
            })
        }
        return res.status(201).json({
            status: "Success",
            message: "LogIn Successfull",
            token: token
        })
    } catch (err) {
        console.log("An error is encountered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

const changeTaskPriority = async () => {
    try {
        const tasks = await TaskModel.find();

        tasks.forEach(async (task) => {
            task.priority = calculatePriority(task.due_date);
            await task.save();
        })
        console.log('Task priorities updated successfully.')
    } catch (err) {
        console.error('Error updating task priorities:', err)
    }
}
schedule.scheduleJob('0 0 * * *', changeTaskPriority)
changeTaskPriority()