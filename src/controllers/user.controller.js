import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {cloudinary_upload} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) => {
    const {fullName, email, userName, password} = req.body

    if(
        [fullName, email, userName, password].some( (field) => 
            field.trim() === ""
        ) 
    ){
        console.log("FIELD - ", field);
        throw new ApiError(400, `All fields need to be filled !`)
    }

    const user = User.findOne({
        $or: [{email},{userName}]
    })

    if(user){
        throw new ApiError(409, "User already exists!")
    }

    const avatarPath = req?.files?.avatar[0]?.path 
    const coverImagePath = req?.files?.coverImage[0]?.path

    if(!avatarPath){
        throw new ApiError(400, "Avatar is required!")
    }
    const avatar = await cloudinary_upload(avatarPath)
    const coverImage = await cloudinary_upload(coverImagePath)

    if(!avatar){
        throw new ApiError(400, "Avatar not uploaded!")
    }

    const userCreated = await User.create({
        fullName,
        userName,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
    })

    const checkUser = await User.findById(userCreated._id).select("-password -refreshToken")

    if(!checkUser){
        throw new ApiError(500, "User has not been created!")
    }

    return new ApiResponse("Registered!", 201, checkUser)

} )

export default registerUser

// if ( [].some( (field) => field.trim("") === "" ) ){ throw new ApiError(400, "Please fill all fields") }