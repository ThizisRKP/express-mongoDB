import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv"
import userRouter from "./routes/userRoutes.js"
import moviesRouter from "./routes/movieRoutes.js"

const PORT = process.env.PORT || 5000;
// if we wnat to use dotenv we have to give like this process.env 
// dotenv is used to access the things which is in env file

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use("/",userRouter);
app.use("/",moviesRouter);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongoDB connected"))
.catch((err)=>console.log("cannot connect DB",err));

app.listen(PORT,()=>
console.log(`server running on http://localhost:${PORT}`));


// meaning of => dotenv.config()

// It loads environment variables from a .env file into process.env.
// By default, Node.js does not automatically read .env files.
// dotenv.config() tells your app to read the file and make those variables available globally.