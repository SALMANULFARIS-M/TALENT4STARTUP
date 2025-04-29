import express from "express";
import { sendOtp, verifyOtp } from "../controllers/auth.controller.js";
// import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register", sendOtp);
router.post("/verify-otp", verifyOtp);
// router.post('/logout', logout);
// router.get('/me', authMiddleware, getMe);

export default router;
