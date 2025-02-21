import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";

function checkCommentValidity(user, video_id, content){
    if( [user,video_id,content].some( (field) => field === undefined || field === null ) ){
        console.log(`Details not received!`)
        return false
    }

    if(!mongoose.isValidObjectId(video_id)){
        console.log(`Received video id is incomplete or wrong`);
        return false
    }

    if(content.length>500){
        console.log(`Too lengthy`);
        false
    }

    return true
}

const addComment = asyncHandler( async (req, res) => {
    const user=req.user

    const {video_id}=req.params
    const {content}=req.body

    console.log(user,video_id,content);
    
    if(!checkCommentValidity(user, video_id, content)){
        console.log(`Bad request!`);
        return res.status(400).json({"message":`Bad request`})
        
    }

    const addComment = await Comment.create({
        username:user._id,
        content:content,
        video:video_id
    })

    if(!addComment){
        console.log(`DB error`);
        return res.status(500).json({"message":`Server error`})
    }

    return res
    .status(200)
    .json({"message":"Comment Added!"})
} )

const addReply = asyncHandler( async (req, res) => {
    const {parent_id, video_id} = req.params
    const user = req.user
    const {content} = req.body

    if(!mongoose.isValidObjectId(parent_id)){
        console.log(`Bad request`);
        return res.status(400).json({"message":`Bad request`})
    }

    if(!checkCommentValidity(user,video_id,content)){
        console.log(`Bad request`);
        return res.status(400).json({"message":`Comment data false`})
    }

    const createReply = await Comment.create({
        username:user._id,video_id: video_id,content: content
    })
    
    if(!createReply){
        console.log(`DB error`);
        return res.status(500).json({"message":"Server error"})
    }

    const parentComment = await Comment.findById(parent_id)
    
    if(!parentComment){
        console.log(`Parent comment not found`);
        return res.status(404).json({"message":"Parent comment not found"})
    }

    parentComment.replies.push(createReply._id)
    await parentComment.save()

    console.log(parentComment.replies);
    
    return res.status(200).json({"message":"Reply added!"})
} )

export {addComment, addReply}