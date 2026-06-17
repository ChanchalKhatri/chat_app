// models/contact.model.js

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    contactUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firstName: String,
    lastName: String,

    phone: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "Hey there 👋",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Contact", contactSchema);
