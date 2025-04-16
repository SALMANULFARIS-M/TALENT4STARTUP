// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: ['Candidate', 'Recruiter', 'Admin'],
      default: 'Candidate',
    },
    city: { type: String },
    area: { type: String },
    pincode: { type: String },
    streetAddress: { type: String },
    resumeUrl: { type: String }, // optional for candidates
    companyName: { type: String }, // optional for employers
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
