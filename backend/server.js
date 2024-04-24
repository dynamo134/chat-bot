import  express  from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connecTOMongoDB from "./db/connectToMongoDB.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.get("/",(req,res)=>{
    //root route 
    res.send("Hello world!");
});
app.use(express.json());//to parse the incomming request with JSON payloads(from req.body)
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/users",userRoutes)
// app.get("/api/auth/signup" ,(req,res)=>{
//     console.log("signup route");
// })

// app.get("/api/auth/loginup" ,(req,res)=>{
//     console.log("loginup route");
// })

// app.get("/api/auth/logout" ,(req,res)=>{
//     console.log("logout route");
// })

app.listen(PORT, ()=> {
    connecTOMongoDB();
    console.log(`server running on port ${PORT}`);
});