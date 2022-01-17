const express = require("express");
const errorMiddlleWare = require("./middlewares/error")
const app = express();
app.use(express.json())


const products = require("./routes/productRoute");

app.use("/api/v1" ,products);

// middleware
app.use(errorMiddlleWare);

module.exports=app;