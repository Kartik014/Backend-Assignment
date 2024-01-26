import { UserModel } from "../models/userModel.js";
import { TaskModel } from "../models/taskModel.js";
import jwt from "jsonwebtoken";
import schedule from "node-schedule";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config({ path: "./Database/config.env" });

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

const changeTaskPriority = async () => {
    try {
        const tasks = await TaskModel.find()

        tasks.forEach(async (task) => {
            task.priority = calculatePriority(task.due_date)
            await task.save()
        })
        console.log('Task priorities updated successfully.')
    } catch (err) {
        console.error('Error updating task priorities:', err)
    }
}
schedule.scheduleJob('0 0 * * *', changeTaskPriority)
changeTaskPriority()

const makeVoiceCall = async () => {
    try {
        const users = await UserModel.find().sort({ priority: 1 })
        const currentDate = new Date()

        for (const user of users) {
            const tasks = await TaskModel.find({
                user_id: user._id,
                due_date: { $lt: currentDate },
            }).sort({ priority: -1 })

            for (const task of tasks) {
                await makeCall(user.phone_number, task.title)
                break;
            }
        }

        console.log('Voice calls completed successfully.')
    } catch (error) {
        console.error('Error making voice calls:', error)
    }
};

const makeCall = async (phoneNumber, taskTitle) => {
    try {
        const client = new twilio(process.env.TIWILIO_SID, process.env.TIWILIO_AUTH_TOKEN)
        const isValidPhoneNumber = await client.lookups.phoneNumbers(phoneNumber)
            .fetch()
            .then(phoneNumber => true)
            .catch(error => false)

        if (!isValidPhoneNumber) {
            console.error(`Invalid phone number: ${phoneNumber}`);
            return;
        }
        await client.calls.create({
            to: phoneNumber,
            from: process.env.TIWILIO_PHONE_NUMBER,
            url: process.env.TIWILIO_URL,
        });

        console.log(`Voice call made to ${phoneNumber} for task: ${taskTitle}`)
    } catch (error) {
        console.error('Error making voice call:', error)
    }
}
schedule.scheduleJob('0 * * * *', makeVoiceCall)
makeVoiceCall()

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