import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import {cloudinary_upload} from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js"

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

export default registerUser

// if ( [].some( (field) => field.trim("") === "" ) ){ throw new ApiError(400, "Please fill all fields") }