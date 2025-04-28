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

    // 3. Find existing user and delete old resume if it exists
    const existingUser = await User.findById(userId);
    if (existingUser?.resume?.filename) {
      const files = await bucket.find({ filename: existingUser.resume.filename }).toArray();
      if (files.length > 0) {
        await bucket.delete(files[0]._id);
        console.log(`Deleted old resume: ${existingUser.resume.filename}`);
      }
    }

    // 4. Create unique filename with timestamp
    const filename = `resume_${userId}_${Date.now()}`;

    // 5. Upload the new file to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        userId,
        originalName: req.file.originalname,
        uploadedAt: new Date(),
      },
    });

    // 6. Handle the upload stream
    await new Promise((resolve, reject) => {
      uploadStream.end(req.file.buffer);

      uploadStream.on("finish", resolve);
      uploadStream.on("error", (err) => {
        console.error("Upload error:", err);
        reject(new Error("Failed to upload resume"));
      });
    });

    // 7. Update user's resume info
    const updatedUser = await User.findByIdAndUpdate(
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

    // 8. Send response
    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      filename,
      user: updatedUser,
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

    const { title, company, years } = req.body;
    if (!title || !company || !years) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          experience: {
            title: title,
            company: company,
            years: years
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
