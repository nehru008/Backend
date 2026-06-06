import express from "express" 
import Mongoose  from "mongoose"
import dotenv from "dotenv"
dotenv.config({
    path:'./env'
})
import connectDB from "../src/db/index.js";
connectDB()



// Approach1 to connect DB

/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/