import express from "express"
import cookieParser from "cookie-parser"

const app = express()

// Middleware to allow requests from your frontend domain
// Helps frontend and backend communicate when running on different origins
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// Parses incoming JSON data from request body
// Example: { "name": "Nehru", "age": 20 }
app.use(express.json({ limit: "16kb" }))

// Parses URL-encoded form data
// Example: name=Nehru&age=20
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

// Serves static files from the "public" folder
// Example: public/image.png -> http://localhost:8000/image.png
app.use(express.static("public"))

// Parses cookies from incoming requests
// Makes cookies available through req.cookies
app.use(cookieParser())

export { app }