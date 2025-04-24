import mongoose from "mongoose";


const ResumeSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  uploadedAt: { type: Date, default: Date.now },
}, { _id: false });

const ApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    resume: ResumeSchema,
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected", "Hired"],
      default: "Applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
