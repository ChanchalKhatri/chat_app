// controllers/contact.controller.js

import Contact from "../models/contact.model.js";
import User from "../models/user.models.js";

export const addContacts = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    // Logged In User ID
    const userId = req.user.id;

    // Validation
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check User Exists In App
    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found on WhatsApp",
      });
    }

    // Prevent Adding Yourself
    if (existingUser._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself",
      });
    }

    // Check Already Added
    const alreadyAdded = await Contact.findOne({
      owner: userId,
      contactUser: existingUser._id,
    });

    if (alreadyAdded) {
      return res.status(400).json({
        success: false,
        message: "Contact already added",
      });
    }

    // Create Contact
    const newContact = await Contact.create({
      owner: userId,
      contactUser: existingUser._id,

      firstName,
      lastName,
      phone,

      profilePic: existingUser.profilePic || "",
      about: existingUser.about || "Hey there 👋",
    });

    return res.status(201).json({
      success: true,
      message: "Contact added successfully",
      contact: newContact,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyContacts = async (req, res) => {
  try {
    const userId = req.user.id;

    const contacts = await Contact.find({
      owner: userId,
    }).populate("contactUser");

    return res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
