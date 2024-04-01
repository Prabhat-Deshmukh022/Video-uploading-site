import connectDB from "./db/db.js";
import dotenv from "dotenv"
import app from "./app.js";

dotenv.config({
    path: './.env'
})

const port_val = process.env.PORT || 8080

connectDB()
.then( () => {
    app.listen(port_val, ()=>console.log( `\n App running on ${port_val}` ))
} )
.catch( (error) => console.error("ERROR IN CONNECTION - ", error) )