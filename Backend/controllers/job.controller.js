import { Job } from "../models/job.model.js";

// ========================== POST JOB ==========================
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, location, salary, jobType, position, companyId, experience } = req.body;

        // Validate required fields
        if (!title || !description || !requirements || !location || !salary || !jobType || !position || !companyId || !experience) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Ensure salary and experience are numbers
        const salaryNum = Number(salary);
        const experienceNum = Number(experience);
        if (isNaN(salaryNum) || isNaN(experienceNum)) {
            return res.status(400).json({
                message: "Salary and experience must be valid numbers",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','), // array
            location,
            salary: salaryNum,
            jobType,
            position,
            company: companyId,
            experience: experienceNum,
            created_by: req.id
        });

        return res.status(201).json({ message: "Job created successfully", success: true, job });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error creating job", success: false, error: error.message });
    }
};

// ========================== GET ALL JOBS ==========================
export const getAllJobs = async (req, res) => {
    try {
        const keywords = req.query.keywords || "";
        const query = {
            $or: [
                { title: { $regex: keywords, $options: "i" } },
                { description: { $regex: keywords, $options: "i" } },
                { requirements: { $regex: keywords, $options: "i" } },
                { location: { $regex: keywords, $options: "i" } },
                { position: { $regex: keywords, $options: "i" } },
                { jobType: { $regex: keywords, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query)
            .populate("company")  // Correct populate syntax
            .sort({ createdAt: -1 });

        if (!jobs.length) {
            return res.status(404).json({ message: "No jobs found", success: false });
        }

        return res.status(200).json({ message: "Jobs fetched successfully", success: true, jobs });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error fetching jobs", success: false, error: error.message });
    }
};

// ========================== GET JOB BY ID ==========================
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("company");
        if (!job) return res.status(404).json({ message: "Job not found", success: false });

        return res.status(200).json({ message: "Job fetched successfully", success: true, job });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error fetching job", success: false, error: error.message });
    }
};

// ========================== GET ADMIN JOBS ==========================
export const getAdminJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ created_by: req.id }).populate("company").sort({ createdAt: -1 });

        if (!jobs.length) {
            return res.status(404).json({ message: "No jobs found", success: false });
        }

        return res.status(200).json({ message: "Admin jobs fetched successfully", success: true, jobs });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error fetching admin jobs", success: false, error: error.message });
    }
};
