import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {cloudinary_upload} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js"

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

    if(user){
        throw new ApiError(409, "User already exists!")
    }

    const avatarPath = req?.files?.avatar[0]?.path 
    const coverImagePath = req?.files?.coverImage[0]?.path

    console.log("Avatar path - ", avatarPath);

    if(!avatarPath){
        throw new ApiError(400, "Avatar is required!")
    }
    const avatar = await cloudinary_upload(avatarPath)
    console.log("Avatar cloudinary - ", avatar);
    const coverImage = await cloudinary_upload(coverImagePath)

    if(!avatar){
        throw new ApiError(400, "Avatar not uploaded!")
    }

    const userCreated = await User.create({
        fullname,
        username,
        email,
        avatar: avatar,
        coverImage: coverImage?.url || "",
        password
    })

    console.log("User - ", userCreated);

    const checkUser = await User.findById(userCreated._id).select("-password -refreshToken")

    if(!checkUser){
        throw new ApiError(500, "User has not been created!")
    }

    return new ApiResponse("Registered!", 201, checkUser)

} )


// if ( [].some( (field) => field.trim("") === "" ) ){ throw new ApiError(400, "Please fill all fields") }

const loginUser = asyncHandler( async (req,res) => {
    const {username, password, email} = req.body
    console.log("In loginUser");
    console.log("LOG - ", req.body);
    console.log("Username, Email and Password - ", username, password, email);

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
        throw new ApiError(400, "Entered password incorrect!")
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id)
    console.log(accessToken, refreshToken);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // console.log("LOGGED IN USER - ", loggedInUser);

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

} )

const logoutUser = asyncHandler( async(req,res) => {

} )

export {loginUser, registerUser, logoutUser}