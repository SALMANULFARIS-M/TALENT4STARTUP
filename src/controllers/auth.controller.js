import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";
import { sendOtpEmail as mailSender } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

// helper to generate a 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;

    if (!email || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Email and purpose are required.",
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins

    // Remove any old OTPs for the same email and purpose
    await Otp.deleteMany({ email, purpose });

    // Save new OTP
    await new Otp({ email, otp, purpose, expiresAt }).save();

    // Send OTP email
    await mailSender(email, otp, purpose);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${email} for ${purpose}`,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, purpose, role } = req.body;

    if (!email || !otp || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and purpose are required.",
      });
    }

    const record = await Otp.findOne({ email, otp, purpose });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or purpose.",
      });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email, purpose });
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    // OTP is valid – delete it
    await Otp.deleteMany({ email, purpose });

    let user = await User.findOne({ email });

    if (purpose === "register") {
      if (!user) {
        // Save with role if provided, else default (handled by schema)
        user = new User({ email, role });
        await user.save();
      }
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `${purpose} OTP verified successfully.`,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
