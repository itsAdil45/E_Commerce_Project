const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../utils/catchAsyncError");
const ApiFeature = require("../utils/apiFeature");

//for admin
exports.createProduct= catchAsyncError(async (req,res, next)=>{
    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({success:true, product});
    });

//get products
exports.getAllProducts=catchAsyncError( async (req,res)=>{
    const resultPerPage = 5;
    const productCount = await  Product.countDocuments();
    const apiFeature = new ApiFeature(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query
    res.status(200).json({success:true, products,productCount});
});

//get products
exports.getProductDetails=catchAsyncError( async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
    return next(new ErrorHandler("product not found" ,404))
    }
    res.status(200).json({success:true, product , productCount});
});



//update product Admin 
exports.updateProduct = catchAsyncError( async (req , res ,next)=>{
let product = await Product.findById(req.params.id);
if(!product){
    return next(new ErrorHandler("product not found" ,404))
    }

product = await Product.findByIdAndUpdate(req.params.id , req.body,{
new:true,
runValidators:true,

useFindAndModify:false
});

res.status(201).json({success:true, product});
}
);

exports.deleteProduct =catchAsyncError( async (req , res ,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found" ,404))
        }
    
    await product.remove();
    
    res.status(201).json({success:true, message:"deleted sucessfully"});
    
});

exports.createProductReview = catchAsyncError(async (req,res,next)=>{

const { rating, comment, productId } = req.body;

const review = {
  user: req.user._id,
  name: req.user.name,
  rating: Number(rating),
  comment,
};

const product = await Product.findById(productId);

const isReviewed = product.review.find(
  (rev) => rev.user.toString() === req.user._id.toString()
);

if (isReviewed) {
  product.review.forEach((rev) => {
    if (rev.user.toString() === req.user._id.toString())
      (rev.rating = rating), (rev.comment = comment);
  });
} else {
  product.review.push(review);
  product.noOfReviews = product.review.length;
}

let avg = 0;

product.review.forEach((rev) => {
  avg += rev.rating;
});

product.ratings = avg / product.review.length;

await product.save({ validateBeforeSave: false });

res.status(200).json({
  success: true,
});
})


exports.getProductReviews = catchAsyncError(async (req,res,next)=>{
const product = await Product.findById(req.query.id);

if(!product){
return next(new ErrorHandler("product is not available with that id", 400))
}

res.status(200).json({
success:true,
review:product.review
})

})

exports.deleteReview = catchAsyncError(async (req,res,next)=>{
const product = await Product.findById(req.query.productId);

if(!product){
  return next(new ErrorHandler("product is not available with that id", 400))
}

const review  = product.review.filter((rev)=>rev._id.toString()!== req.query.id.toString());
let avg = 0;

review.forEach((rev) => {
  avg += rev.rating;
});

const ratings = avg / review.length;
const noOfReviews = review.length;

await Product.findByIdAndUpdate(req.query.productId,{
  review,ratings,noOfReviews
},{
  new:true,
  runValidators:true,
  useFindAndModify:false
})

res.status(200).json({
  success:true,
  })


})