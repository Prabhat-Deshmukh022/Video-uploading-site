import { Router } from "express";
import { addVideoToPlaylist, getUserPlaylist, playlist } from "../controllers/playlist.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const playlistRouter = Router()

playlistRouter.route("/createPlaylist").post( verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /playlist POST");
    await playlist(req,res)
} ) )

playlistRouter.route("/addVideoToPlaylist/video/:video_id/playlist/:playlist_id").post( verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /addToPlayList");
    await addVideoToPlaylist(req,res)
} ) )

playlistRouter.route("/getPlaylists").get( verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /getVideos");
    await getUserPlaylist(req,res)
} ) )


export {playlistRouter}