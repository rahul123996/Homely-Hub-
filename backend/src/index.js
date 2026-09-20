import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import {router} from "./routes/userRoutes.js"
import { propertyRouter } from "./routes/propertyrouter.js";
import { bookingRouter } from "./routes/bookingRouter.js";
import { tripRouter } from "./routes/tripRouter.js";

dotenv.config();


const app = express();

//express.json
app.use(express.json({ limit: "100mb" }));

//urlencoded
app.use(express.urlencoded({ limit: "100mb", extended: true }));

//cookieParser
app.use(cookieParser());

app.use(cors({
    origin:process.env.ORIGIN_ACCESS_URL,
    credentials:true
}))


const PORT = process.env.PORT;


//one test route
app.get("/", (req, res) => {
    res.send("Homelyhub server is running")
})

app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing", propertyRouter)
app.use("/api/v1/rent/user/booking",bookingRouter)
app.use("/api/v1/rent/trip", tripRouter)

connectDB();

app.listen(PORT, () => {
    console.log(`App is running on port no: ${PORT}`);
})