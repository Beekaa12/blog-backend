const express=require("express");
const cors= require("cors");
const connectdb = require("./src/Config/db");
const dotenv = require("dotenv").config()
const app = express();
const authRoutes = require("./src/Routes/authRoutes");
const postRoutes = require("./src/Routes/postRoutes");
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
connectdb();
const port=process.env.PORT
app.listen(port,()=>{
  console.log(`Server running on localhost ${port}`);
})