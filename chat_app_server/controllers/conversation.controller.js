import Conversation from "../models/conversation.model.js";

// CREATE OR GET CONVERSATION
export const createOrGetConversation = async (req, res) => {
  try {
    const senderId = req.user.id;

    const { receiverId } = req.body;

    // Validation
    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    // Prevent self chat
    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot create conversation with yourself",
      });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate(
      "participants",
      "name phone profilePic description",
    );

    // Create new if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "name phone profilePic description",
      );
    }

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.log("Create Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET MY CONVERSATIONS
export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate(
        "participants",
        "name phone profilePic description",
      )
      .sort({
        lastMessageTime: -1,
      });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.log("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
