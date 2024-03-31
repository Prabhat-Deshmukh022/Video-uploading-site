# Nodejs_BackendProject

DATABASE CONNECTION (troubleshooting) -

1. Run using nodemon
2. Use this connection string only: mongodb://127.0.0.1:27017
3. If all else fails, ensure MongoDB service is running and its binaries have been uploaded to PATH and retry 1. and 2.

APP CONFIGURATION -

1. npm i cors cookie-parser
2. use the method cookieParser() on its own and not express.cookieParser()
3. Set environment variable CORS = \* (for now)
4. Async handler in utils ie

const asyncHandler = (fn) = async (req,res,next) => {
try{
await fn(req,res,next)
}
catch(err){
res.status(err.code).json({
success: false,
message: err.message
})
}
}
