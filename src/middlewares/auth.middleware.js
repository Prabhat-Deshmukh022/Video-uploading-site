import asyncHandler from "../utils/asyncHandler";

const verifyJWT = asyncHandler( async (req,res) => {
    const getCookies = req.cookies?.accessToken
} )