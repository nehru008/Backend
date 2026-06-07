
import Mongoose  from "mongoose"
import connectDB from "../src/db/index.js";

import dotenv from "dotenv"
dotenv.config({path:'./env'})

const PORT = process.env.PORT || 8000 

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server connected on port:${PORT}`)

    })

}).catch((err)=>{
    console.log("Mongodb not connected",err)

})



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