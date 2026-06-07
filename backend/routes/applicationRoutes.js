import ApplicationController from "../controllers/applicationController.js";
import express from "express";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Apply for job
router.get("/apply/:jobId", verifyToken, ApplicationController.applyJob);

// get all applied jobs for student
router.get("/get-applied", verifyToken, ApplicationController.getAppliedjobs);

// get all applicants for admin
router.get(
  "/:jobId/applicants",
  verifyToken,
  ApplicationController.getAllApplicants,
);

router.patch("/:id", verifyToken, ApplicationController.updateStatus);

export default router;
