import Application from "../models/application.js";
import Job from "../models/job.js";

class ApplicationController {
  static async applyJob(req, res) {
    try {
      const userId = req.id;
      const { jobId } = req.params;
      console.log("req params :-----", jobId);

      if (!jobId) {
        return res
          .status(400)
          .json({ success: false, message: "JobId is required" });
      }
      // Find if there is any existing application..
      const existingApplication = await Application.findOne({
        job: jobId,
        applicant: userId,
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this job",
        });
      }

      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(400).json({ message: "Job doesn't exist" });
      }

      const newApplication = await Application.create({
        job: jobId,
        applicant: userId,
      });

      job.applications.push(newApplication._id);
      await job.save();

      return res
        .status(201)
        .json({ success: true, message: "Job applied successfully" });
    } catch (err) {
      console.log("error:-", err);
      return res.status(500).json({ message: "Internal Server error" });
    }
  }

  static async getAppliedjobs(req, res) {
    try {
      const userId = req.id;

      const applications = await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "job",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "company",
            options: { sort: { createdAt: -1 } },
          },
        });

      if (!applications) {
        return res
          .status(400)
          .json({ success: false, message: "No applications found" });
      }

      return res.status(200).json({
        success: true,
        message: "Applications fetched successfully",
        applications,
      });
    } catch (error) {
      console.log('ERROR:-',error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  static async getAllApplicants(req, res) {
    try {
      const { jobId } = req.params;
      if (!jobId) {
        return res.status(400).json({
          success: false,
          message: "jobid is required",
        });
      }

      const job = await Job.findById(jobId).populate({
        path: "applications",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "applicant",
          select : "fullName email phoneNumber"
        },
      });

      if (!job) {
        return res
          .status(400)
          .json({ success: false, message: "Job not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Applicants for this job fetched successfully",
        job,
      });
    } catch (err) {
      console.log("Error :-", err);
      return res.status(500).json("Internal server Error");
    }
  }

  static async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const { id } = req.params; // ApplicationId
      if (!status) {
        return res
          .status(400)
          .json({ success: false, message: "status is required" });
      }
      if (!id) {
        return res
          .status(400)
          .json({ message: "Application id is required", success: false });
      }

      const application = await Application.findById(id);
      if (!application) {
        return res
          .status(400)
          .json({ success: false, message: "Application not found" });
      }

      // Update Status
      application.status = status;

      await application.save();

      return res.status(200).json({
        success: true,
        message: `Application updated successfully to ${status}`,
      });
    } catch (error) {
      console.log("Error:-", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server error" });
    }
  }
}

export default ApplicationController;
