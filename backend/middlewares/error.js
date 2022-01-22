const ErrorHandler = require("../utils/errorHandler")


module.exports =(err,req,res, next)=>{
err.statusCode = err.statusCode || 500;
err.message = err.message || "internal server error";

if(err.name =="CastError")
{
const message = `Resource not found ${err.path}`
err = new ErrorHandler(message,400)
}

if(err.code ==11000)
{
const message = `Dublicate Email entered`
err = new ErrorHandler(message,400)
}

if(err.name =="JsonWebTokenError")
{
const message = `JsonWebTokenError is not valid try again`
err = new ErrorHandler(message,400)
}

if(err.name =="TokenExpiredError")
{
const message = `Json web token is expired`
err = new ErrorHandler(message,400)
}

res.status(err.statusCode).json({
success:false,
message:err.message



})


}