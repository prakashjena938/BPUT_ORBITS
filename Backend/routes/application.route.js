import express from 'express';
import authenticateToken from '../middleware/isAuthenticated.js';
import {
    applyJob,
    getApplicants,
    getAppliedJobs,
    updateStatus
} from '../controllers/application.controller.js';

const router = express.Router();

// Apply for a job (JOB ID)
router.route("/apply/:id").post(authenticateToken, applyJob); // ✅ changed GET → POST

// Get all jobs applied by a user 
router.route("/get").get(authenticateToken, getAppliedJobs);

// Get applicants for a specific job (JOB ID)  (APPLICATION ID)  (APPLICANT ID)   (STATUS)  (RESUME)
router.route("/:id/applicants").get(authenticateToken, getApplicants);

// Update applicant status  (APPLICATION ID) 
router.route("/status/:id/update").put(authenticateToken, updateStatus);

export default router;
