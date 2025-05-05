import express from "express";
import {
  getAllUsers,
  addUserDetails,
  addUserResume,
  addUserExperience,
  getUserById,
  updateUserProfile,
  updateJobPreferences,
  getUserResume,
  getUserProfile,
  getJobPreferences,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.js";
// import authMiddleware from '../middlewares/authMiddleware.js';
// import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get("/", getAllUsers);
router.post("/user-detail", addUserDetails);
router.post("/user-resume", upload.single("resume"), addUserResume);
router.post("/user-experience", addUserExperience);
router.put("/user-detail", addUserDetails);
router.put("/user-resume", upload.single("resume"), addUserResume);
router.put("/user-experience", addUserExperience);
router.put("/user-profile", updateUserProfile);
router.get("/user-profile/:userId", getUserProfile);
router.put("/user-job-pref", updateJobPreferences);
router.get("/user-job-pref/:userId", getJobPreferences);
router.get("/resume/:userId", getUserResume); //window.open(`https://talent4startup.onrender.com/resume/${user._id}`, "_blank");
router.get("/:userId", getUserById);

// router.put('/:id',  updateUser);
// router.delete('/:id', adminMiddleware, deleteUser);

export default router;
