import express from "express";
import JobController from "../controllers/job.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE JOB FOR ADMIN
router.post("/create", verifyToken, JobController.createJob);

//For student
router.get("/jobs", verifyToken, JobController.getAllJobs);

//For student
router.get("/:jobId", verifyToken, JobController.getJobById);

//For ADMIN:-
router.get("/createdJobs", verifyToken, JobController.getCreatedJobs);

export default router;