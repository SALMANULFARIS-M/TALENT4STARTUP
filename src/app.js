import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import jobRoutes from "./routes/jobsRoutes.js";


dotenv.config();
connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:4200", "https://studyinbengaluru.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(helmet());
app.use(morgan("dev"));


// Routes
app.use('/jobs', jobRoutes);
// app.use("/auth", authRoutes);
// app.use('/users', userRoutes);
// app.use('/admin', adminRoutes);


export default app;
