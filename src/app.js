import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

import {userRouter} from "./routes/user.routes.js";
import { playlistRouter } from "./routes/playlist.routes.js";
import { videoRouter } from "./routes/video.routes.js";
import { commentRouter } from "./routes/comment.routes.js";

app.use("/api/user/v1", userRouter)
app.use("/api/playlist/v1", playlistRouter)
app.use("/api/video/v1", videoRouter)
app.use("/api/comment/v1", commentRouter)

export default app