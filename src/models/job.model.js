// models/Job.ts
import mongoose from "mongoose";


const JobSchema= new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companyDescription: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship"],
      default: "Full-time",
    },
    salary: { type: String, required: true },
    locationType: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      required: true,
    },
    city: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
    streetAddress: { type: String, required: true },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;

  