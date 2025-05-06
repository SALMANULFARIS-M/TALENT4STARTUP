import mongoose from "mongoose";

// Single education entry
const EducationSchema = new mongoose.Schema(
  {
    degree: String,
    institution: String,
    year: String,
  },
  { _id: false } 
);

// Single certificate entry
const CertificateSchema = new mongoose.Schema(
  {
    name: String,
    org: String,
  },
  { _id: false }
);

// Qualification block (has its own _id)
const QualificationSchema = new mongoose.Schema(
  {
    education: EducationSchema, 
    cert: CertificateSchema,    
    skill: [{ type: String }],
    lang: [
      {
        type: String,
        enum: [
          "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada", "Kashmiri",
          "Konkani", "Maithili", "Malayalam", "Manipuri", "Marathi", "Nepali", "Odia", "Punjabi", 
          "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu",
        ],
      },
    ],
  },
  { _id: true }
);

// Other subdocuments
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

// Main User schema
const UserSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    workEmail: String,
    phone: String,
    password: String,
    role: {
      type: String,
      enum: ["Candidate", "Recruiter"],
      default: "Candidate",
    },
    address: String,
    companyName: String,
    resume: ResumeSchema,
    experience: ExperienceSchema,
    jobPref: JobPrefSchema,
    qualification: QualificationSchema, 
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
