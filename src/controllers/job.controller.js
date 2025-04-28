import Job from "../models/job.model.js";
import Application from "../models/application.model.js";

export const createPost = async (req, res, next) => {
  try {
    const {
      companyName,
      companyDescription,
      jobTitle,
      jobDescription,
      salary,
      jobType,
      locationType,
      city,
      area,
      pincode,
      streetAddress,
      id,
    } = req.body;
    if (
      !id ||
      !companyName ||
      !companyDescription ||
      !jobTitle ||
      !jobDescription ||
      !salary ||
      !jobType ||
      !locationType ||
      !city ||
      !area ||
      !pincode ||
      !streetAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Required field is not provided",
      });
    }

    const newJob = new Job({
      recruiter: id,
      companyName,
      companyDescription,
      jobTitle,
      jobDescription,
      jobType,
      salary,
      locationType,
      city,
      area,
      pincode,
      streetAddress,
    });

    const savedJob = await newJob.save();
    res.status(201).json({
      success: true,
      message: "Job post created successfully",
      job: savedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Job.find({});
    res.status(200).json({
      success: true,
      message: "All job posts fetched successfully",
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const applyToJob = async (userId, jobId) => {
  try {
    const application = new Application({
      user: userId,
      job: jobId,
      status: "Applied",
    });
    res.status(200).json({
      success: true,
      message: "successfully applied",
      application,
    });
    await application.save();
  } catch (error) {
    next(error);
  }
};
