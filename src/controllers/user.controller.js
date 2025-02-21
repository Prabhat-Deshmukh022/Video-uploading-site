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

const generateAccessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.accessToken()
        const refreshToken = await user.refreshTokenFunc()

        user.refreshToken=refreshToken
        await user.save()

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(400, "Error in access or refresh token generation")
    }
}

const registerUser = asyncHandler( async (req,res) => {
    console.log("In registerUser");
    const {fullname, email, username, password} = req.body
    console.log("REQ.BODY - ",fullname, email, username, password)

    try {
        if(
            [fullname, email, username, password].some( (field) => 
                field.trim() === ""
            ) 
        ){
            // console.log("FIELD - ", field);
            throw new ApiError(400, `All fields need to be filled !`)
        }
    
        console.log("Before await ");
        const user = await User.findOne({
            $or: [{email},{username}]
        })
        console.log(`After finding user`);
    
        if(user){
            throw new ApiError(409, "User already exists!")
        }
    
        const avatarPath = req?.files?.avatar[0]?.path 
        const coverImagePath = req?.files?.coverImage
    
        console.log("Avatar path - ", avatarPath);

        const coverImage=null;

        if(coverImagePath !== undefined){
            coverImage = await cloudinary_upload(coverImagePath)
        }
    
        if(!avatarPath){
            throw new ApiError(400, "Avatar is required!")
        }
        const avatar = await cloudinary_upload(avatarPath)
        console.log("Avatar cloudinary - ", avatar);
    
        if(!avatar){
            throw new ApiError(400, "Avatar not uploaded!")
        }
    
        const userCreated = await User.create({
            fullname,
            username,
            email,
            avatar: avatar.secure_url,
            coverImage: coverImage?.secure_url || "",
            password
        })
    
        console.log("User - ", userCreated);
    
        const checkUser = await User.findById(userCreated._id).select("-password -refreshToken")
    
        if(!checkUser){
            throw new ApiError(500, "User has not been created!")
        }
    
        console.log("Check user - ", checkUser);
    
        return res
        .status(200)
        .json(checkUser)
    
    } catch (error) {
        console.log(`REGISTER USER ERROR ${error}`);
        return res
        .status(400)
        .json({message:error})
    }
} )


// if ( [].some( (field) => field.trim("") === "" ) ){ throw new ApiError(400, "Please fill all fields") }

const loginUser = asyncHandler( async (req,res) => {
    const {username, password, email} = req.body
    console.log("In loginUser");
    console.log("LOG - ", req.body);
    console.log("Username, Email and Password - ", username, password, email);

    try {
            if(!username || !email){
                console.log("IN EXCEPTION 1");
                throw new ApiError(400, "Username or Email not entered")
            }
            console.log("JUST OUTSIDE EXCEPTION 1");
        
            const user = await User.findOne({
                $or:[{username}, {email}]
            })
        
            console.log("User obtained - ", user);
        
            if (!user) {    
                console.log("404 user not found");
                throw new ApiError(404, "User not found")
            }
        
            const isPasswordValid = await user.isPasswordCorrect(password)
        
            if(!isPasswordValid){
                console.log("PASS WORD NOT");
                throw new ApiError(401, "Entered password incorrect!")
            }
        
            const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id)
            console.log(accessToken, refreshToken);
        
            const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        
            console.log("LOGGED IN USER - ", loggedInUser);
        
            const options = 
            {
                httpOnly: true,
                secure: true
            }
        
            res.
            status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(loggedInUser)
        
    } catch (error) {
        console.log(`Caught error ${error}`);
        return res
        .status(404)
        .json({message:"Wrong Details! No login"})
    }
} )

const logoutUser = asyncHandler( async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined}
        },
        {
            new: true
        }
    )

    const options = 
    {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({"success": "User logged out"})
} )

const refreshAccessToken = asyncHandler( async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        console.log("Not received refreshToken");
        throw new ApiError(401, "Unauthorized req")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if(!user){
        console.log("User not here ! Invalid token");
        throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        console.log("WRONG TOKEN");
        throw new ApiError(401, "Wrong token")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, refreshNewToken} = await generateAccessandRefreshTokens(user._id)

    res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshNewToken, options)
    .json({"success of gen token": true})

} )

const changePassword = asyncHandler( async (req,res) => {
    const {newPassword} = req.body
    console.log("New password ", newPassword);

    const user = await User.findById(req.user._id)

    if (!user) {
        console.log("User not found!");
    }
    console.log("User - ", user);

    const userPassword = await user.password
    console.log("User password - ", userPassword);

    user.userPassword = newPassword
    await user.save()

    return res
    .status(201)
    .json(user)

} )

const getCurrentUser = asyncHandler( async (req,res) => {
    return res
    .status(200)
    .json(req.user)
} )

const updateUserInfo = asyncHandler( async (req,res) => {
    console.log("In updateUser");

    const {newUsername, newFullname, newEmail} = req.body
    console.log("New data ", newUsername, newFullname, newEmail);

    const user = await User.findByIdAndUpdate(req.user._id,
    {
        $set:{username: newUsername, fullname: newFullname, email: newEmail}
    },  
    {
        new: true
    })

    console.log("User ", user);

    return res
    .status(200)
    .json(user)
} )

const updateAvatar = asyncHandler( async (req,res) => {
    const newAvatar = req.file?.path
    console.log("New avatar - ", newAvatar);

    const avatar = await cloudinary_upload(newAvatar)
    console.log("Cloudinary upload ", avatar);

    const user = await User.findByIdAndUpdate(req.user._id,
    {
        $set: {avatar: avatar.url}
    },
    {
        new:true
    })

    return res
    .status(201)
    .json(user.avatar)
} )

const getChannels = asyncHandler( async (req,res) => {

    const username = req.params.username
    console.log("Username - ", username);
    if(!username){
        console.log("Username not received!");
    }

    const channels = await User.aggregate([{
        $match: {username: username}
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "owner",
            as: "subscribers"
        }
    },
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"
        }
    },
    {
        $addFields: {
            subscriberCount: {
                $size: "$subscribers"
            },
            channelsSubscribedTo: {
                $size: "$subscribedTo"
            },
            isSubscribed: {
                $cond: {
                    if: {$in: [req.user._id, "$subscribers.subscriber"]},
                    then: true,
                    else: false
                }
            }
        }
    },
    {
        $project: {
            username: 1,
            avatar: 1,
            subscriberCount: 1,
            channelsSubscribedTo: 1,
            isSubscribed: 1
        }
    }])

    console.log("Channels - ", channels);

    if (!channels) {
        console.log("Channels does not exist!");
    }

    return res
    .status(200)
    .json(channels[0])

} )

const watchHistory = asyncHandler( async (req,res) => {
    const user = await User.aggregate([{
        $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
        }
    },
    {
        $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            pipeline: [
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [{
                            $project:{
                                username: 1,
                                avatar: 1
                            }
                        }]
                    }
                },
                {
                    $addFields:{
                        owner: {
                            $first: "$owner"
                        }
                    }
                }
            ]
        }   
    }])

    return res
    .status(201)
    .json(user[0].watchHistory)

} )

const deleteUser = asyncHandler( async (req,res) => {
    const user = req.user
    console.log("User logged in - ", user);

    const {username, email, password} = req.body
    console.log("User current info received - ", username, email, password);

    if (!(username === user.username) && !(email === user.email) && !(bcryptjs.compare(password, user.password))) {
        console.log("User info wrong, cannot delete user!");
        message = {"Error": "User info wrong"}
        return res.status(400).json(message)
    }

    const toDelUser = await User.findByIdAndDelete(req.user._id)

    if (!toDelUser) {
        console.log("Could not delete user!");
        message = {"Error": "Could not delete user!"}
        return res.status(500).json(message)
    }

    console.log("Deleted user - ", toDelUser);

    return res
    .status(200)
    .json(toDelUser)
} )

export {loginUser, registerUser, logoutUser, refreshAccessToken, changePassword, 
    getCurrentUser, updateUserInfo, updateAvatar, getChannels, watchHistory
        ,deleteUser}