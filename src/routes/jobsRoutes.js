import express from "express";
import {
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
  deleteJob,
  applyJob,
} from "../controllers/jobController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import employerMiddleware from "../middlewares/employerMiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", employerMiddleware, postJob);
router.put("/:id", employerMiddleware, updateJob);
router.delete("/:id", employerMiddleware, deleteJob);
router.post("/:id/apply", authMiddleware, applyJob);

module.exports = router;
