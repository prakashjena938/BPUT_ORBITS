import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//=============================register===========================//
export const register = async (req, res) => {

    try {
        const { fullname, email, phoneNumber } = req.body;
        if (!fullname || !email ||!phoneNumber) {
            return res.status(400).json({ message: "All fields are required field is missing" ,
                success: false,
                error: error.message
            });

        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists",
                success: false,
                error: error.message
            });
        }
    
     ///convert pass to hashhhh
     const hashedPassword = await bcrypt.hash(req.body.password, 10);

     // create a new user
     const newUser = new User({ fullname, email, phoneNumber, password: hashedPassword, role });
     await newUser.save();
     res.status(201).json({ message: "User registered successfully",
        success: true,
        user: newUser
     });

     return res.status(200).json({ message: `Acount created successfully ${fullname}`,
        success: true,
     })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error registering failed",
            success: false,
            error: error.message
        });
        
    }
};

   //=============================login===========================//

export const login = async (req, res) => {

    try {

        // get user by email
        const { email, password, role } = req.body;
        if (!email ||!password ||!role) {
            return res.status(400).json({ message: "All fields are required field is missing",
                success: false,
                error: error.message
            });
        }

        // find user by email
        let  user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found, incorrect email or password",
                success: false,
                error: error.message
            });
        }

        // compare password  with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password",
                success: false,
                error: error.message
            });
        }


        // check if role is correct
        if (user.role!== role) {
            return res.status(401).json({ message: "Unauthorized access role is not match",
                success: false,
                error: error.message
            });
        }


        // // generate jwt token
      const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d', });

      user ={
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      }

    
     return res.status(200).cookie("token", token,{maxAge:1*24*60*60*1000, httponly:true, sameSite: "Strict",

     })
     .json({ message: `welcome back ${user.fullname}`, user,
        success: true,
        
     });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error login failed",
            success: false,
            error: error.message
        });
    }
};

//=============================logout===========================//
export const logout = async (req, res) => {

    try {
        return res.status(200).Cookie("token", "", { maxAge: 0,}).json({ message: "Logged out successfully", 
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error logout failed",
            success: false,
            error: error.message
        });
        
    }
};

//=============================update_user===========================//

export const updateProfile = async (req, res) => {
    try {
        const { fullname, phoneNumber, bio, skills,email } = req.body;
        const file = req.file;
          if (!fullname || !email ||!phoneNumber ||!bio ||!skills) {
            return res.status(400).json({ message: "All fields are required field is missing" ,
                success: false,
            });
        }

        //cloudinary upload







        const skillsArray = skills.split(',');
        const userId = req.user._id;     // middleware to get user id from token
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found",
                success: false,
            });

        }
        
            user.fullname = fullname;
            user.email = email;
            user.phoneNumber = phoneNumber;
            user.bio = bio;
            user.skills = skillsArray;

            await user.save();

        user ={
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      }
      return res.status(200).json({ message: "User updated successfully", user,
            success: true,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating user failed",
            success: false,
        });
        
    }
};