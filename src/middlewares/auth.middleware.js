import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyJWT = asyncHandler( async (req,res,next) => {
    try {
        console.log("In verify JWT");
        const getCookies = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer", "")
    
        if(!getCookies){
            console.log("IN EXCEPTION 1");
            throw new ApiError(404, "No token!")
        }
        console.log("JUST OUTSIDE EXCEPTION 1");
    
        const decodedToken = jwt.verify(getCookies, process.env.ACCESS_TOKEN_SECRET)
        console.log("Decoded error - ", decodedToken);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            console.log("In USER NOT FOUND ERROR");
            throw new ApiError(404, "User has not been found")
        }


        req.user = user
        next()
    }
     catch (error) {
        console.error("In error!!!!!1!1",error);
        return res
        .status(404)
        .json({message:"No token, No user"})
    } })

export {verifyJWT}