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
      userId,
    } = req.body;
    if (
      !userId ||
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
      recruiter: userId,
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

export const applyToJob = async (req, res, next) => {
  try {
    if (!req.body.userId || !req.body.jobId) {
      return res.status(400).json({
        success: false,
        message: "Required field is not provided",
      });
    }
    const application = new Application({
      user: req.body.userId,
      job: req.body.jobId,
      status: "Applied",
    });

    await application.save();
    res.status(200).json({
      success: true,
      message: "successfully applied",
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserApplications = async (req, res, next) => {
  try {
    if (req.params.userId === undefined) {
      return res.status(400).json({
        success: false,
        message: "User id is not provided",
      });
    }
    const userId = req.params.userId;
    const applications = await Application.find({ user: userId })
    res.status(200).json({
      success: true,
      message: "User applications fetched successfully",
      applications,
    });
  } catch (error) {
    next(error);
  }
};
