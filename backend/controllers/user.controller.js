import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserController {
  static async Register(req, res) {
    try {
      const { fullName, email, password, phoneNumber, role } = req.body;

      if (!fullName || !email || !password || !phoneNumber || !role) {
        return res.status(400).json({
          message: "Please enter all the fields to register",
          success: false,
        });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message: "User already exists with the role",
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        fullName,
        email,
        phoneNumber,
        role,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "User Account created successfully",
        success: true,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        success: false,
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password || !role) {
        return res
          .status(400)
          .json({ message: "Please enter all the fields", success: false });
      }

      let user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found...Please register",
          success: false,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Invalid Credentials", success: false });
      }

      if (role !== user.role) {
        return res.status(400).json({
          message: "Account does not exist with the current role",
          success: false,
        });
      }

      const tokenData = {
        userId: user._id,
        role: user.role,
      };

      const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      user = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        role: user.role,
      };

      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: `Welcome back ${user.fullName}`,
          user,
          token,
          success: true,
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async logout(req, res) {
    try {
      return res
        .status(200)
        .cookie("token", "", { httpOnly: true, sameSite: "strict", maxAge: 0 })
        .json({
          message: "User logged out successfully",
          success: true,
        });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error Logging out", success: false });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { fullName, phoneNumber, email, bio, skills } = req.body;
      const file = req.file;

      let skillsArray;
      if (skills) {
        skillsArray = skills.split(",");
      }
      const userId = req.id;

      let user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
      }

      //Updating the user data below :-
      if (fullName) {
        user.fullName = fullName;
      }
      if (phoneNumber) {
        user.phoneNumber = phoneNumber;
      }
      if (email) {
        user.email = email;
      }
      if (bio) {
        user.profile.bio = bio;
      }
      if (skills) {
        user.profile.skills = skillsArray;
      }

      await user.save();

      user = {
        _id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        profile: user.profile,
        role: user.role,
      };

      return res
        .status(200)
        .json({ success: true, message: "User updated successfully" }, user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server error" });
    }
  }
}

export default UserController;
