import Job from "../models/job.js";

class JobController {
  // For Admin
  static async createJob(req, res) {
    try {
      const {
        title,
        description,
        requirements,
        salary,
        experienceLevel,
        location,
        jobType,
        companyId,
        position,
      } = req.body;

      const userId = req.id;
      if (
        !title ||
        !description ||
        !requirements ||
        !salary ||
        !experienceLevel ||
        !location ||
        !jobType ||
        !companyId ||
        !position
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Please enter all the fields" });
      }

      const job = await Job.create({
        title,
        description,
        requirements: requirements.split(","),
        salary: Number(salary),
        experienceLevel,
        jobType,
        location,
        position,
        company: companyId,
        createdBy: userId,
      });

      return res.status(201).json({
        success: true,
        message: "Job created successfully for this Company",
        job,
      });
    } catch (err) {
      console.log("Error :-", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // For Student
  static async getAllJobs(req, res) {
    try {
      const { keyword = " " } = req.query;
      const query = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
      const userId = req.id;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User is not logged in" });
      }

      const jobs = await Job.find(query)
        .populate({
          path: "company",
          // populate : {
          //   path : "userId"
          // }
        })
        .sort({ createdAt: -1 });
      if (!jobs) {
        return res
          .status(404)
          .json({ success: false, message: "Jobs not found" });
      }

      return res.status(200).json({
        success: true,
        message: "All jobs fetched successfully",
        jobs,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  // For student
  static async getJobById(req, res) {
    try {
      const { jobId } = req.params;
      if (!jobId) {
        return res
          .status(400)
          .json({ success: false, message: "Please provide the Job id" });
      }

      const job = await Job.findById(jobId);
      if (!job) {
        return res
          .status(404)
          .json({ success: false, message: "Job doesn't exist" });
      }

      return res
        .status(201)
        .json({ success: true, message: "Job fetched Successfully", job });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // For Admin
  static async getCreatedJobs(req, res) {
    try {
      const adminId = req.id;
      const jobs = await Job.find({ createdBy: adminId });

      if (!jobs) {
        return res.status(400).json({
          success: false,
          message: "No jobs created by the logged in user",
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "Jobs fetched successfully", jobs });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server error" });
    }
  }
}

export default JobController;
