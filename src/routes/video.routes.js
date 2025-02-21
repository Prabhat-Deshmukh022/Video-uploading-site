import { videoUpload, deleteVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Router } from "express";

const videoRouter = Router()

videoRouter.route("/videoUpload").post(verifyJWT, upload.fields([
    {
        name: "video",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }
]), 

asyncHandler( async(req,res) => {
    console.log("In /videoUpload POST");
    await videoUpload(req,res);
} ))

videoRouter.route("/videoDelete/:videoid").delete(verifyJWT, asyncHandler( asyncHandler( async (req,res) => {
    console.log("In /videoDelete DELETE");
    await deleteVideo(req,res)
} ) ))

export {videoRouter}

