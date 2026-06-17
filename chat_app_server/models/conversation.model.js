import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // Chat Participants
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Last Message
    lastMessage: {
      type: String,
      default: "",
    },

    // Last Message Sender
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Last Message Time
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
