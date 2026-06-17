// controllers/message.controller.js

import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { conversationId, receiverId, text, type } = req.body;

    let fileUrl = "";
    let messageType = "text";
    let messageText = text;

    // ----------------------------
    // FILE HANDLING
    // ----------------------------
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      const mime = req.file.mimetype;

      if (mime.startsWith("image/")) {
        messageType = "image";
      } else if (mime.startsWith("video/")) {
        messageType = "video";
      } else if (mime.startsWith("audio/")) {
        messageType = "audio";
      } else {
        messageType = "document";
      }

      // For media files, don't use filename as text
      // Only use filename for documents
      if (messageType !== "document") {
        messageText = text || "";
      } else {
        messageText = req.file.originalname;
      }
    } else if (type) {
      messageType = type;
    }

    // ----------------------------
    // CREATE MESSAGE
    // ----------------------------
    const message = await Message.create({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      text: messageText,
      type: messageType,
      file: fileUrl,
      delivered: true,
    });

    // ----------------------------
    // SIDEBAR PREVIEW LOGIC
    // ----------------------------
    let sidebarPreview = messageText || "";

    if (messageType === "image") sidebarPreview = "📷 Photo";
    if (messageType === "video") sidebarPreview = "🎥 Video";
    if (messageType === "audio") sidebarPreview = "🎤 Audio";
    if (messageType === "document") sidebarPreview = "📄 Document";

    if (!messageText && fileUrl) {
      sidebarPreview = "Attachment";
    }

    // ----------------------------
    // UPDATE CONVERSATION
    // ----------------------------
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: sidebarPreview,
      lastMessageSender: senderId,
      lastMessageTime: new Date(),
    });

    // ----------------------------
    // EMIT SOCKET EVENT
    // ----------------------------
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("new-message", message);
      io.to(conversationId).emit("message-updated", {
        conversationId,
        lastMessage: sidebarPreview,
        lastMessageTime: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------------------------------------
// GET MESSAGES
// --------------------------------------------------

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    // Mark messages as seen if user is the receiver
    await Message.updateMany(
      { conversationId, receiver: userId, seen: false },
      { seen: true }
    );

    // Emit seen status
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("messages-seen", {
        conversationId,
        userId,
      });
    }

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("GET MESSAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------------------------------------
// CLEAR MESSAGES
// --------------------------------------------------

export const clearMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId });

    // Update conversation to clear last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: "",
      lastMessageSender: null,
      lastMessageTime: null,
    });

    // Emit socket event to clear messages for all users in conversation
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("messages-cleared", {
        conversationId,
      });
      io.to(conversationId).emit("message-updated", {
        conversationId,
        lastMessage: "",
        lastMessageTime: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Messages cleared successfully",
    });
  } catch (error) {
    console.log("CLEAR MESSAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
