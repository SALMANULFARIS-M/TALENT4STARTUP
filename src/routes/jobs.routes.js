import express from "express";
import {
  getAllPosts,
  createPost,
  applyToJob,
  getUserApplications,
  getJobsByRecruiter,
  getApplicationsForRecruiter,
  updateApplicationStatus,
} from "../controllers/job.controller.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/create", createPost);
router.post("/applys", applyToJob);
router.get("/:userId", getJobsByRecruiter);
router.get("/application/:userId", getUserApplications);
router.get("/recruiter/:recruiterId", getApplicationsForRecruiter);
router.get("/application/status/:applicationId", updateApplicationStatus);


// router.get('/:id', getPostById);
// router.put('/:id', authMiddleware, updatePost);
// router.delete('/:id', authMiddleware, deletePost);
// router.post('/:id/like', authMiddleware, likePost);
// router.post('/:id/comment', authMiddleware, commentPost);

export default router;
