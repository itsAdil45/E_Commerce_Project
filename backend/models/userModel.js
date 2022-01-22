const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxlength: [30, "name should not exceed 30 character"],
    minlength: [4, "name should not be lesser than 4 character"],
  },

  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter the valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: [8, "password should not be lesser than 8 character"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,  


});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.getJwtToken = function(){
return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE,
});
}

//compare pass
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword ,this.password)
  }

userSchema.methods.getResetPasswordToken = function(){
const resetToken  = crypto.randomBytes(20).toString("hex");
this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
this.resetToken = Date.now *15 *60 *1000;
return resetToken;
}

module.exports = mongoose.model("User" ,userSchema);