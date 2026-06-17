// models/message.model.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Conversation reference
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // Sender user
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Receiver user
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Text message
    text: {
      type: String,
      trim: true,
      default: "",
    },

    // Message type
    type: {
      type: String,
      enum: ["text", "media", "document", "image", "video"],
      default: "text",
    },

    // Image message
    image: {
      type: String,
      default: "",
    },

    // Voice message
    audio: {
      type: String,
      default: "",
    },

    // File
    file: {
      type: String,
      default: "",
    },

    // Message status
    seen: {
      type: Boolean,
      default: false,
    },

    delivered: {
      type: Boolean,
      default: false,
    },

    // Deleted message
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
