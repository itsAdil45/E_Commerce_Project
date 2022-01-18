const Product = require("../backend/models/productModel");
const ErrorHandler = require("../backend/utils/errorHandler");
const catchAsyncError = require("../backend/utils/catchAsyncError");
const ApiFeature = require("../backend/utils/apiFeature");

//for admin
exports.createProduct= catchAsyncError(async (req,res, next)=>{
    const product = await Product.create(req.body);
    res.status(201).json({success:true, product});
    });

//get products
exports.getAllProducts=catchAsyncError( async (req,res)=>{
    const apiFeature = new ApiFeature(Product.find(),req.query).search().filter();
    const products = await apiFeature.query
    res.status(200).json({success:true, products});
});

//get products
exports.getProductDetails=catchAsyncError( async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
    return next(new ErrorHandler("product not found" ,404))
    }
    res.status(200).json({success:true, product});
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