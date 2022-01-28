const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name"],
    
  },
  description: {
    type: String,
    required: [true, "Please enter the product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter the product price"],
    maxLength: [8, "price cannot exceed 8 character"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please enter the product category"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter the product stock"],
    maxLength: [4, "stock cannot exceed 4"],
    default: 1,
  },
  noOfReviews: {
    type: Number,
    default:0
  },
  review: [
    {
      user:{
        type :mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    }
  ],
  user:{
    type :mongoose.Schema.ObjectId,
    ref:"User",
    required:true

  },
  createAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);