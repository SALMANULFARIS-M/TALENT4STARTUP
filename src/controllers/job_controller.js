import Job from "../models/job.model.js";

export const createPost = async (req, res, next) => {
  try {
    const {
      companyName,
      companyDescription,
      jobTitle,
      jobDescription,
      salary,
      locationType,
      city,
      area,
      pincode,
      streetAddress,
    } = req.body;

    const newJob = new Job({
      companyName,
      companyDescription,
      jobTitle,
      jobDescription,
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
    console.error("Error creating job post:", error);
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
        console.error("Error fetching job posts:", error);
        next(error);
    }
}