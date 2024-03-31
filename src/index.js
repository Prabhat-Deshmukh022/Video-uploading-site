import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
connectDB()

// import express from "express"
// app = express()

// ( async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {console.log("ERROR IN APP - ", error);} )
//         app.listen(process.env.PORT, () => {console.log(`APP LISTENING ON ${process.env.PORT}`);} )
//     }catch(error){
//         console.error("ERROR - ", error)
//     }
// } )()