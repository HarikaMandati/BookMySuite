import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import hotelRoute from "./routes/hotels.js"
import roomRoute from "./routes/rooms.js"
import userRoute from "./routes/users.js"
const app = express()
dotenv.config()

const connect = async () => {
try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDB")
}catch(error) {

  throw error;
}
};

mongoose.connection.on("disconnected", () =>{
    console.log("mongoDB disconnected!")
})

mongoose.connection.on("connected", () =>{
    console.log("mongoDB connected!")
})

app.get("/", (req,res) => {
    res.send("hello first request");
})


//middleware 
app.use("/api/auth",authRoute);
app.use("/api/hotel",hotelRoute);
app.use("/api/room",roomRoute);
app.use("/api/user",userRoute);

app.listen(8800,()=>{
    connect()
    console.log("Connected to backend.")
});