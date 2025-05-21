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

export const getJobsByRecruiter = async (req, res, next) => {
  const { userId } = req.params; 
  try {
    const jobs = await Job.find({ recruiter: userId }).sort({ createdAt: -1 }); // most recent first (optional)
    res.status(200).json({
      success: true,
      message: `Jobs posted by recruiter ${userId} fetched successfully`,
      jobs,
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


export const getApplicationsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.params.recruiterId;

    // Find all job IDs posted by this recruiter
    const jobs = await Job.find({ recruiter: recruiterId }).select("_id");

    const jobIds = jobs.map((job) => job._id);

    // Find applications for those jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("user")
      .populate("job");

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Error getting applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/applicationController.ts
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Applied", "Shortlisted", "Rejected", "Hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate("user", "firstName email").populate("job", "jobTitle");

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Status updated", application: updated });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
