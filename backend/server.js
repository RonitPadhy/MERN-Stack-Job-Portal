import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import jobRoutes from "./routes/job.routes.js";
const app = express();
dotenv.config();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/job",jobRoutes);
connectDB();
const corsOptions = {
  origin: "http://localhost:5173", //Frontend
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("hello , i am creating a new project");
});

app.listen(port, () => {
  console.log("Server has listening on the port 3000");
});
