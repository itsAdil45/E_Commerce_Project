const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const { use } = require("express/lib/application");
const sendEmail = require("../utils/sendEmail");
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
  sendToken(user, 201, res);
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

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logut successfully",
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `your reset password token is ${resetPasswordUrl} \n\n if you have not try to reset then ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `email has been sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    // resetPasswordExpire:{$gt:Date.now()},
  });

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("pass does not match", 400));
  }
  if (!user) {
    return next(
      new ErrorHandler("Reset password token is expired or invalid", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user
  });
});


// get all users by admin
exports.getAllUsers = catchAsyncError(async (req,res,next)=>{
const users = await User.find();

res.status(200).json({
success:true,
users,

})

})

// get single user by admin
exports.getSingleUser = catchAsyncError(async (req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler("user does not available with that id"),400)
  }
  res.status(200).json({
  success:true,
  user,
  })
  
  })

// update user role and details by admin
  exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    const user = await User.findByIdAndUpdate(req.params.id, newUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if(!user){
      return next(new ErrorHandler("user does not available with that id"),400)
    }
  
    res.status(200).json({
      success: true,
      user
    });
  });


// delete user  by admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {

  const user = User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler("user does not available with that id"),400)
  }
  await user.remove();

  res.status(200).json({
    success: true,
  });
});
