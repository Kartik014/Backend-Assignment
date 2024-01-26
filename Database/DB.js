import mongoose from "mongoose";

export const connectionDB = () => {
    mongoose.connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("Database connected"))
        .catch((error) => console.log("Connection error", error))
}