import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import {cloudinary_upload} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import bcryptjs from "bcryptjs";
import { Playlist } from "../models/playlist.models.js";

const playlist = asyncHandler( async (req,res) => {
    const { videotitle } = req.params;
    const {name, description} = req.body
    const user = req.user
    console.log(name, description);

    if(!(name && description)){
        return res.status(500).send("Please enter name and description!")
    }

    // Trim the videotitle to remove any leading/trailing spaces
    let trimmedTitle = videotitle.trim();
    trimmedTitle = trimmedTitle.substring(1)
    console.log(trimmedTitle);

    // const checkOne = await Playlist.findOne({name: name})

    // if(checkOne){
    //     console.log("Names of two playlists cannot be same!");
    //     return res.status(500).send("Name of two playlists cannot be same")
    // }

    const video = await Video.findOne({ title: trimmedTitle });
    console.log("Found Video:", video._id);

    let playlist = await Playlist.findOne({name: name})

    if(!playlist){
        playlist = await Playlist.create({
        name: name,
        description:description,
        owner: user._id    
        })
    }

    playlist.videos.push(video._id)
    playlist.description = description
    await playlist.save()

    console.log(playlist);

    return res.
    status(200)
    .json(playlist)
} )

const getUserPlaylist = asyncHandler( async (req,res) => {
    const user_id = req.user._id
    console.log("User id is ", user_id);

    if (!user_id) {
        return res.status(404).send("Could not find user!")
    }

    const playlistOf = await Playlist.find({owner: user_id})
    if (!playlistOf) {
        return res.status(404).send("Could not find playlist!")
    }

    console.log("Playlist received ", playlistOf);

    return res
    .status(200)
    .json(playlistOf)
} )


export {playlist, getUserPlaylist}
