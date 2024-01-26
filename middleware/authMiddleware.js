import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: './Database/config.env' });

export const authenticateUser = (req, res, next) => {
    console.log(req.headers)
    const token = req.headers["authtoken"]
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized user"
        })
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decode.user_id)
        req.user_id = decode.user_id
        next()
    } catch (err) {
        console.log("An error is encoutered: ", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}