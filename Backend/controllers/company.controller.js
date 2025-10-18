import { Company } from "../models/company.model.js";

//================= Register Company =================//
export const registerCompany = async (req, res) => {
    try {
        const { companyName, description, website, location, logo } = req.body;

        if (!companyName) {
            return res.status(400).json({ message: "Company Name is required", success: false });
        }

        const existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({ message: "Company already exists", success: false });
        }

        const company = await Company.create({
            name: companyName,
            description: description || "",
            website: website || "",
            location: location || "",
            logo: logo || "",
            userId: req.id, // from auth middleware
        });

        return res.status(201).json({
            message: "Company registered successfully",
            success: true,
            company
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error registering company",
            success: false,
            error: error.message
        });
    }
};

//================= Get All Companies =================//
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ userId: req.id });

        if (!companies.length) {
            return res.status(404).json({ message: "No companies found", success: false });
        }

        return res.status(200).json({ message: "Companies fetched successfully", success: true, companies });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error fetching companies", success: false, error: error.message });
    }
};

//================= Get Company by ID =================//
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        return res.status(200).json({ message: "Company fetched successfully", success: true, company });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error fetching company", success: false, error: error.message });
    }
};

//================= Update Company =================//
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location, logo } = req.body;

        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        // Only update provided fields
        if (name) company.name = name;
        if (description) company.description = description;
        if (website) company.website = website;
        if (location) company.location = location;
        if (logo) company.logo = logo;

        await company.save();

        return res.status(200).json({ message: "Company updated successfully", success: true, company });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error updating company", success: false, error: error.message });
    }
};
