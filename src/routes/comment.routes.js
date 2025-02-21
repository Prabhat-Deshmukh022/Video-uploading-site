import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { addComment, addReply } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const commentRouter = new Router()

commentRouter.route("/addComment/:video_id").post( verifyJWT, asyncHandler( async (req,res) => {
    console.log(`In /addComment POST`);
    await addComment(req,res)
} ) )

commentRouter.route("/addReply/parent/:parent_id/video/:video_id").post( verifyJWT, asyncHandler( async (req,res) => {
    console.log(`In addReply POST`);
    await addReply(req,res)
} ))

export {commentRouter}