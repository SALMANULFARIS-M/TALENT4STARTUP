import dotenv from "dotenv";
import {connectDB} from "./src/config/db.js"; // ✅ Importing connectDB function
import app from "./src/app.js"; // ✅ Importing already initialized app

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to Database First
connectDB();

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
