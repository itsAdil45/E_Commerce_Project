const express = require("express");
const req = require("express/lib/request");
const errorMiddlleWare = require("./middlewares/error")
const app = express();
const cookie_parser = require("cookie-parser"); 
app.use(express.json())
app.use(cookie_parser());

const products = require("./routes/productRoute");
const user = require("./routes/userRoute");
app.use("/api/v1" ,products);
app.use("/api/v1",user)

// middleware
app.use(errorMiddlleWare);

module.exports=app;