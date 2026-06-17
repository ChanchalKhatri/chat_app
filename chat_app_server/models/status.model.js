// models/status.model.js

import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
  {
    // User who created the status
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Status content (image URL or text)
    content: {
      type: String,
      required: true,
    },

    // Status type (image, text, video)
    type: {
      type: String,
      enum: ["image", "text", "video"],
      default: "image",
    },

    // Caption for the status
    caption: {
      type: String,
      default: "",
    },

    // Viewers of this status (array of user IDs who viewed it)
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Status expiration (24 hours from creation by default)
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      },
    },

    // Whether status is expired
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index to automatically clean up expired statuses
statusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Status = mongoose.model("Status", statusSchema);

export default Status;
