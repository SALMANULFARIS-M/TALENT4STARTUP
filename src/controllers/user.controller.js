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
      const files = await bucket
        .find({ filename: existingUser.resume.filename })
        .toArray();
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
    const { userId, title, company, years } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

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
            years: years,
          },
        },
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

export const updateUserQualification = async (req, res, next) => {
  try {
    const { userId, education, skill, cert, lang } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!education || !skill || !cert || !lang) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "qualification.education": {
            degree: education.degree,
            institution: education.institution,
            year: education.year,
          },
          "qualification.cert": {
            name: cert.name,
            org: cert.org,
          },
          "qualification.skill": skill, 
          "qualification.lang": lang,   
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserQualification = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).select("qualification");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.qualification,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobPreferences = async (req, res, next) => {
  try {
    const { userId, jobTitle, minPay, jobTypes, workSchedule, relocation } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!jobTitle || !minPay || !jobTypes || !workSchedule || !relocation) {
      return res.status(400).json({
        success: false,
        message: "Job preference fields are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          jobPref: {
            jobTitle: jobTitle,
            minPay: minPay,
            jobTypes: jobTypes,
            workSchedule: workSchedule,
            relocation: relocation,
          },
        },
      },
      { new: true } // return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job preferences updated successfully",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getJobPreferences = async (req, res, next) => {
  try {
    const userId  = req.params.userId; // Or use req.params if route param

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).select("jobPref");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      jobPref: user.jobPref,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;
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

export const getUserResume = async (req, res, next) => {
  try {
    const bucket = getGridFSBucket();
    const { userId } = req.params;

    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2. Fallback: Try to find any resume uploaded by this user
    let filename = user.resume?.filename;

    if (!filename) {
      const files = await bucket
        .find({ "metadata.userId": userId })
        .sort({ "metadata.uploadedAt": -1 }) // latest file first
        .toArray();

      if (files.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No resume found for this user" });
      }

      filename = files[0].filename;
    }

    // 3. Check if file exists
    const file = await bucket.find({ filename }).toArray();
    if (file.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Resume file not found" });
    }

    // 4. Serve the PDF
    res.set("Content-Type", "application/pdf");
    const stream = bucket.openDownloadStreamByName(filename);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};
