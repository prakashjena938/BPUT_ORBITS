import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// APPLY FOR A JOB
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) return res.status(400).json({ message: "Job ID is required", success: false });

    const existingApplication = await Application.findOne({ applicant: userId, job: jobId });
    if (existingApplication)
      return res.status(400).json({ message: "You have already applied for this job", success: false });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    const newApplication = await Application.create({ applicant: userId, job: jobId });

    return res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      application: newApplication
    });

  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ message: "Server error submitting application", success: false, error: error.message });
  }
};

// GET ALL JOBS APPLIED BY A USER
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "job", populate: { path: "company" } });

    if (!applications.length)
      return res.status(404).json({ message: "No applications found", success: false });

    return res.status(200).json({ message: "Applications fetched successfully", success: true, applications });

  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: "Server error fetching applications", success: false, error: error.message });
  }
};

// GET APPLICANTS FOR A JOB
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const applications = await Application.find({ job: jobId })
      .sort({ createdAt: -1 })
      .populate("applicant", "fullname email phoneNumber role") // essential info
      .populate("job", "title company");

    if (!applications.length)
      return res.status(404).json({ message: "No applicants found for this job", success: false });

    return res.status(200).json({ message: "Applicants fetched successfully", success: true, applicants: applications });

  } catch (error) {
    console.error("Error fetching applicants:", error);
    return res.status(500).json({ message: "Server error fetching applicants", success: false, error: error.message });
  }
};

// UPDATE APPLICATION STATUS
export const updateStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!status || !["pending", "approved", "rejected"].includes(status.toLowerCase()))
      return res.status(400).json({ message: "Invalid status value", success: false });

    const application = await Application.findById(applicationId);
    if (!application)
      return res.status(404).json({ message: "Application not found", success: false });

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({ message: "Application status updated successfully", success: true, application });

  } catch (error) {
    console.error("Error updating application status:", error);
    return res.status(500).json({ message: "Server error updating status", success: false, error: error.message });
  }
};
