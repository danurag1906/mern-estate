import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/user.routers.js";
import authRouter from "./routers/auth.routers.js";
import listingRouter from "./routers/listing.routers.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

mongoose
  .connect(
    "mongodb+srv://mern-estate:mern-estate@mern-estate-cluster.3genvsj.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to db !");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
app.use(express.json()); //to parse the data coming from the client side
app.use(cookieParser()); //to access the information from the cookies

app.listen(3000, () => {
  console.log("server is running on port 3000 ! ");
});

//our api endpoints
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist"))); // we will join the dirname form the render server to /client/dist (dist is created after building the vite+ react app)

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
}); //for any address apart from the above three mentioned routes in app.use(), we will redirect the user to index.html

//middleware for error handling
app.use((err, req, res, next) => {
  //err-> the error created
  //next->going to the next middleware (function basically)
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
