const Product = require("../backend/models/productModel");

//for admin
exports.createProduct= async (req,res, next)=>{
const product = await Product.create(req.body);
console.log(product);
res.status(201).json({success:true, product});
}

//get products
exports.getAllProducts= async (req,res)=>{
    const products = await Product.find();
    res.status(200).json({success:true, products});
}

//update product Admin 
exports.updateProduct = async (req , res ,next)=>{
let product = await Product.findById(req.params.id);
if(!product){

res.status(500).json({
success:false,
message :"product not found"
})
}

product = await Product.findByIdAndUpdate(req.params.id , req.body,{
new:true,
runValidators:true,

useFindAndModify:false
});

res.status(201).json({success:true, product});

}


exports.deleteProduct = async (req , res ,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
    
    res.status(500).json({
    success:false,
    message :"product not found"
    })
    }
    
    await product.remove();
    
    res.status(201).json({success:true, message:"deleted sucessfully"});
    
    }