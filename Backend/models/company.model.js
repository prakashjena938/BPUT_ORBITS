import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: "" // optional now
    },
    website: {
        type: String,
        default: "" // optional now
    },
    location: {
        type: String,
        default: ""
    },
    logo: {
        type: String, // optional for now
        default: ""
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);
