import bcrypt, { hash } from "bcryptjs";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, phone, password, description, profilePic } = req.body;

    // Check Existing User
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      description,
      profilePic,
    });

    // Response
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // const hashedPassword = await hash(password, 10);

    const pass = await bcrypt.compare(password, user.password);

    if (!pass) {
      return res.status(401).json({
        success: false,
        message: "Password doesnt match",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
