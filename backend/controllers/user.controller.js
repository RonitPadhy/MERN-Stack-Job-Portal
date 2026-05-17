import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";

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
}
