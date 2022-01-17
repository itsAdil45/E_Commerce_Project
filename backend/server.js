const app = require("./app");
const dotenv = require("dotenv");
const connectDataBase = require('./config/database');

dotenv.config({path:"backend/config/config.env"})

connectDataBase();

app.listen(process.env.PORT, ()=>{
console.log(`server is running on http://localhost:${process.env.PORT}`)

})