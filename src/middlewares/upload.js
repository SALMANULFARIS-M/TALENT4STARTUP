import multer from "multer";

// Configure Multer
export const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept PDF files
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});
