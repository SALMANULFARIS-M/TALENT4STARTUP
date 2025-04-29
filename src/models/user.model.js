// models/User.ts
import mongoose from "mongoose";

// Education Subschema
const EducationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    year: String,
  },
  { _id: false }
);

// Skill Subschema
const SkillSchema = new mongoose.Schema(
  {
    name: String,
    level: String,
  },
  { _id: false }
);

// Certificate Subschema
const CertificateSchema = new mongoose.Schema(
  {
    name: String,
    org: String,
  },
  { _id: false }
);

// Language Subschema
const LanguageSchema = new mongoose.Schema(
  {
    name: String,
    level: String,
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    years: Number,
  },
  { _id: false }
);
const JobPrefSchema = new mongoose.Schema(
  {
    jobTitle: String,
    minPay: String,
    jobTypes: String,
    workSchedule: String,
    relocation: String,
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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
    companyName: { type: String }, // optional for employers
    // Embedded Documents (All optional)
    resume: ResumeSchema,
    experience: ExperienceSchema,
    education: EducationSchema,
    skill: SkillSchema,
    cert: CertificateSchema,
    lang: LanguageSchema,
    jobPref: JobPrefSchema,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
