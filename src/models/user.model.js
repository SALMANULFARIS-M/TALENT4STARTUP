// models/User.ts
import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  years: Number,
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    workEmail: { type: String },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: ["Candidate", "Recruiter"],
      default: "Candidate",
    },
    address: { type: String },
    resume: ResumeSchema,
    experience: ExperienceSchema,
    companyName: { type: String }, // optional for employers
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
