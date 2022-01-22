const User = require("../backend/models/userModel");
const ErrorHandler = require("../backend/utils/errorHandler");
const catchAsyncError = require("../backend/utils/catchAsyncError");
const sendToken = require("../backend/utils/jwtToken");
const { use } = require("express/lib/application");
const sendEmail = require("../backend/utils/sendEmail")
const crypto = require("crypto");


exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is avatar id",
      url: "this is url",
    },
  });
  sendToken(user, 201,res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);


});


exports.logout=catchAsyncError( async(req,res,next)=>{
res.cookie("token", null ,{
expires: new Date(Date.now()),
httpOnly:true
});

res.status(200).json({
success: true,
message: "logut successfully"
});
});

exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
const user = await User.findOne({email:req.body.email});

if(!user){
return next(new ErrorHandler("user not found" , 404))
}

const resetToken = user.getResetPasswordToken();
await user.save({validateBeforeSave:false});

const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

const message = `your reset password token is ${resetPasswordUrl} \n\n if you have not try to reset then ignore it`;

try {
  await sendEmail({
    email: user.email,
    subject: `password recovery`,
    message,



  })

  res.status(200).json({
    success: true,
    message: `email has been sent to ${user.email}`

  })
  
} catch (error) {
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
   await user.save({validateBeforeSave:false});
   return next(new ErrorHandler(error.message, 500))
}

})


exports.resetPassword = catchAsyncError(async (req,res,next)=>{
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    // resetPasswordExpire:{$gt:Date.now()},
  });

  if(req.body.password!=req.body.confirmPassword){
    return next(new ErrorHandler("pass does not match" ,400)) 

  }
  if (!user) {
    return next(new ErrorHandler("Reset password token is expired or invalid" ,400))
  }


  

   user.password = req.body.password;
   user.resetPasswordToken = undefined;
   user.resetPasswordExpire = undefined;
   await user.save();

   sendToken(user, 200 ,res)
})