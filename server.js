import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js"; // ✅ Importing connectDB function
import app from "./src/app.js"; // ✅ Importing already initialized app
import os from "os"; // ✅ Importing os module

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to Database First
connectDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Talent4Startup API",
    version: "4.3.0",
    frontend: "https://talendforstartup-frontend-mp74.vercel.app/",
    host: os.hostname(),
    platform: os.platform(),
    uptime: process.uptime().toFixed(0) + "s",
  });
});
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`❌ Error: ${message}`);
  res.status(statusCode).json({ success: false, message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
