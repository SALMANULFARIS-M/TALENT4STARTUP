import User from "../models/user.model.js";
import { getGridFSBucket } from "../config/db.js";

export const addUserDetails = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, city, userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!firstName || !lastName || !email || !phone || !city) {
      return res.status(400).json({
        success: false,
        message: "Required field is not provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        workEmail: email, // using workEmail correctly
        phone,
        address: city,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserResume = async (req, res, next) => {
  try {
    // 1. Validate required fields and file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // 2. Get GridFS bucket
    const bucket = getGridFSBucket();

    // 3. Create unique filename with timestamp
    const filename = `resume_${userId}_${Date.now()}`;

    // 4. Upload the file
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        userId,
        originalName: req.file.originalname,
        uploadedAt: new Date(),
      },
    });

    // 5. Handle the upload process
    await new Promise((resolve, reject) => {
      uploadStream.end(req.file.buffer);

      uploadStream.on("finish", resolve);
      uploadStream.on("error", (err) => {
        console.error("Upload error:", err);
        reject(new Error("Failed to upload resume"));
      });
    });

    // 6. Update user record (optional but recommended)
    // Assuming you have a User model
    const user = await User.findByIdAndUpdate(
      userId,
      {
        resume: {
          filename,
          originalName: req.file.originalname,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    );

    // 7. Send success response
    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      filename,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserExperience = async (req, res, next) => {
  try {

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          experience: {
            title: "Senior Developer",
            company: "Tech Solutions",
            years: 7
          }
        }
      },
      { new: true } // returns the updated document
    );


  
    // 7. Send success response
    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};
