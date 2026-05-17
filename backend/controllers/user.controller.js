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

      const hashedPassword = await bcrypt.hash("password", 10);

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

      const user = await UserModel.findOne({ email });
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
        _id: user._id,
        role: user.role,
      };

      const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
        expiresIn: "1d",
      });

      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 1 * 24 * 60 * 60 * 1000,
        })
        .json({
          message: "User logged in Succesfully",
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
}
