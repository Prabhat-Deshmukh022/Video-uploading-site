import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js"
import mongoose from "mongoose";

console.log("APP ", process.env.CORS_ORIGIN);

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true, limit: "16kb"
}))

app.use(express.static("public")) //For any other files like images etc, same name folder must be created in root dir

app.use(cookieParser()) //cookieParser() populates req.cookies, which will be available in json

// ----------------------------------------------------------------------------------------------------------------

import {router} from "./routes/user.routes.js";
import {registerUser, loginUser} from "./controllers/user.controller.js";

app.use("/api", router)

// app.post('/register', upload.fields([
//     {
//         name: "avatar",
//         maxCount: 1
//     }, 
//     {
//         name: "coverImage",
//         maxCount: 1
//     }
// ]), async (req, res) => { // Make the route handler asynchronous
//     try {
//         console.log("In /register POST");
//         const reVal = await registerUser(req, res); // Await registerUser function
//         console.log(reVal);
//         res.status(200).send("Registration Successful");
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });



export default app