import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//=============================register===========================//
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "Email already exists",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while registering",
            success: false,
            error: error.message,
        });
    }
};


//=============================login===========================//

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password",
                success: false,
            });
        }

        if (user.role !== role) {
            return res.status(401).json({
                message: "Unauthorized access - role mismatch",
                success: false,
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

        res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "Strict",
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                success: true,
                user,
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during login",
            success: false,
            error: error.message,
        });
    }
};


//=============================logout===========================//
export const logout = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({
                message: "Logged out successfully",
                success: true,
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during logout",
            success: false,
            error: error.message,
        });
    }
};


//=============================update_user===========================//

export const updateProfile = async (req, res) => {
    try {
        const { fullname, phoneNumber, bio, skills, email } = req.body;
        // if (!fullname || !email || !phoneNumber || !bio || !skills) {
        //   return res.status(400).json({
        //     message: "All fields are required",
        //     success: false,
        //   });
        // }
        let skillsArray;
        if (skills) {
            const skillsArray = skills.split(",");
        }
        const userId = req.id; //  from middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }


        // update  database fields

        if (fullname) { user.fullname = fullname; }

        if (email) { user.email = email; }

        if (phoneNumber) { user.phoneNumber = phoneNumber; }

        if (bio) { user.profile.bio = bio; }

        if (skills) { user.profile.skills = skillsArray; }



        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error updating profile",
            success: false,
            error: error.message,
        });
    }
};
