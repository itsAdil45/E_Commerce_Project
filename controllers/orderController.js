const Order = require("../backend/models/orderModel");
const Product = require("../backend/models/productModel");
const ErrorHandler = require("../backend/utils/errorHandler");
const catchAsyncError = require("../backend/utils/catchAsyncError");

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getSingOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new ErrorHandler("order not found with that id", 400));
  }

  res.status(200).json({
    success: true,
    order,
  });
});


//get logged in user orders
exports.myOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.find({user:req.user._id})
    if (!order) {
      return next(new ErrorHandler("order not found with that id", 400));
    }
    res.status(200).json({
      success: true,
      order,
    });
  });
  

  //admin route get all orders
  exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find();
    let totalAmount = 0;
    order.forEach((order)=>{
        totalAmount += order.totalPrice
    });
    res.status(200).json({
      success: true,
      totalAmount,
      order,
    });
  });


  //admin route --- update order
  exports.updateOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("order not found with that id", 400));
      }

    if(order.orderStatus=="Delivered"){
        return next(new ErrorHandler("Order is already delivered" ,400))
    }
    order.orderItems.forEach(async (order)=>{
        await updateStock(order.product, order.quantity)
    })

    order.orderStatus = req.body.status;
    if(req.body.status=="Delivered"){
        order.deliveredAt =Date.now()
    }
    await order.save({valdateBeforeSave:false});

    res.status(200).json({
      success: true,
      order,
    });
  });

  async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock -=quantity;
    await product.save({valdateBeforeSave:false})}



  //admin route delete order
  exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    await order.remove();
    if (!order) {
        return next(new ErrorHandler("order not found with that id", 400));
      }
    res.status(200).json({
      success: true,
    });
  });