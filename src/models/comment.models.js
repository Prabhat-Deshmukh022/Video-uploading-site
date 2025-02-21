import mongoose, { Schema } from "mongoose";

const commentScehma = new Schema({
    username:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type: String,
        minLength:1,
        maxLength:500,
        required:true
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    replies:[
        {
            type:Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
},{timestamps:true})

export const Comment = mongoose.model("Comment", commentScehma) 