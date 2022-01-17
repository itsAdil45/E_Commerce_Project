const app = require("./app");
const dotenv = require("dotenv");
const connectDataBase = require('./config/database');

process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Server is closing due to uncaught Exception Error`);
    process.exit(1);
    })

dotenv.config({path:"backend/config/config.env"})

connectDataBase();

const server = app.listen(process.env.PORT, ()=>{
console.log(`server is running on http://localhost:${process.env.PORT}`)

})


process.on("unhandledRejection",(err)=>{
console.log(`Error: ${err.message}`);
console.log(`Server is closing due to unhandle Rejection Error`);
server.close(()=>{
    process.exit(1);
})
})