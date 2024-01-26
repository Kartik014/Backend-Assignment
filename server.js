import { app } from "./index.js";
import { connectionDB } from "./Database/DB.js";

connectionDB()

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`)
})