import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, changePassword, getCurrentUser, updateUserInfo, updateAvatar, getChannels, watchHistory, videoUpload, deleteUser, deleteVideo} from "../controllers/user.controller.js";
import {getUserPlaylist, playlist} from "../controllers/playlist.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, 
    {
        name: "coverImage",
        maxCount: 1
    }
]), asyncHandler (async (req, res) => { // Make the route handler asynchronous
    console.log("In /register POST");
    const reVal = await registerUser(req, res); // Await registerUser function
    console.log(reVal);
    res.json(reVal)
    }
));

router.route("/login").post( asyncHandler( async (req,res) => {
    console.log("In /login POST");
    await loginUser(req, res)
} ) )

router.route("/logout").post( verifyJWT,
asyncHandler( async (req,res) => {
    console.log("In /logout POST");
    await logoutUser(req,res)
} ))

router.route("/refresh").post( asyncHandler ( async (req,res) => {
    console.log("In refresh /POST");
    await refreshAccessToken(req,res)
} ) )

router.route("/changePassword").post( verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /changePassword POST");
    await changePassword(req,res)
} ) )

router.route("/getUser").get( verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /getUser GET");
    await getCurrentUser(req,res)
} ) )

router.route("/updateUser").patch(verifyJWT, 
asyncHandler( async (req,res) => {
    console.log("In /updateUser POST");
    await updateUserInfo(req,res)
} ))

router.route("/updateAvatar").post(verifyJWT, upload.single("avatar"), 
asyncHandler( async (req,res) => {
    console.log("In /updateAvatar");
    await updateAvatar(req,res)
} )
)

router.route("/c/:username").get(verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /c/:username\n");
    await getChannels(req,res)
} ))

router.route("/history").get(verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /history POST");
    await watchHistory(req,res)
} ))

router.route("/videoUpload").post(verifyJWT, upload.fields([
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

router.route("/deleteUser").delete(verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /deleteUser DELETE");
    await deleteUser(req,res)
} ))

router.route("/videoDelete").delete(verifyJWT, asyncHandler( asyncHandler( async (req,res) => {
    console.log("In /videoDelete DELETE");
    await deleteVideo(req,res)
} ) ))

router.route("/p/:videotitle").post( verifyJWT, asyncHandler( async (req,res) => {
    console.log("In /playlist POST");
    await playlist(req,res)
} ) )

export { router };