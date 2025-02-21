import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { cloudinary_upload } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const videoUpload = asyncHandler( async (req,res) => {
    const user = req.user
    console.log("User is logged in - ", user.username);

    const video = req?.files?.video[0].path
    const thumbnail = req?.files?.thumbnail[0].path
    console.log("Video and thumbnail path is - ",video, thumbnail);

    if(!video && !thumbnail){
        console.log("Require video and thumbnail!");
        // throw new ApiError()
    }

    const {title, description} = req.body
    console.log("Body - ", title, description);

    if(!title && !description){
        console.log("Require title and description");
        throw new ApiError(404, "Title or description required!")
    }

    const titleExists = await Video.findOne({
        title:title
    })

    if(titleExists){
        console.log(`Video with this title already exists!`);
        return res.status(400).json({"message":`Video with this title already exists!`})
    }

    const videoFile = await cloudinary_upload(video)
    const thumbnailFile = await cloudinary_upload(thumbnail)
    console.log("Cloudinary video and thumbnail file - ", videoFile.secure_url, thumbnailFile.secure_url);

    try {
        const videoDetails = await cloudinary.api.resource(videoFile.public_id, {
            resource_type: 'video',
            type:"upload"
        });
        console.log('Video details:', videoDetails.duration);
        // Extract duration and other information from videoDetails
    } catch (error) {
        console.error('Error fetching video details:', error);
    }

    const videoCreated = await Video.create({
        videoFile: videoFile.secure_url,
        thumbnail: thumbnailFile.secure_url,
        title: title,
        description: description,
        owner: user._id,
        username: user.username
    })

    console.log(videoCreated);

    if(!videoCreated){
        console.log("ERROR IN DB");
    }

    return res
    .status(200)
    .json(videoCreated)
} )

const deleteVideo = asyncHandler( async (req,res) => {
    const user = req.user
    console.log("User is ", user.username);
    
    const {videoid} = req.params
    console.log("Video id ", videoid);

    if(!videoid || !mongoose.isValidObjectId(videoid)){
        console.log(`Invalid request, issue with received video id`);
        return res.status(400).json({"message":`Invalid request, issue with received video id`})
    }

    const deletedVideo = await Video.findByIdAndDelete(videoid)
    
    console.log(deletedVideo);
    
    return res
    .status(200)
    .json(deletedVideo)
})


export {videoUpload, deleteVideo}