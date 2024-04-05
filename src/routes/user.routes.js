import { Router } from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/user.controller.js";
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

export { router };
