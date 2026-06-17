// controllers/status.controller.js

import Status from "../models/status.model.js";

// --------------------------------------------------
// CREATE STATUS
// --------------------------------------------------
export const createStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, type, caption } = req.body;

    // Handle file upload if present
    let statusContent = content;
    let statusType = type || "image";

    if (req.file) {
      statusContent = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      const mime = req.file.mimetype;
      if (mime.startsWith("image/")) {
        statusType = "image";
      } else if (mime.startsWith("video/")) {
        statusType = "video";
      }
    }

    const status = await Status.create({
      user: userId,
      content: statusContent,
      type: statusType,
      caption: caption || "",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Populate user details
    await status.populate("user", "name email profilePic");

    return res.status(201).json({
      success: true,
      status,
    });
  } catch (error) {
    console.log("CREATE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------------------------------------
// GET MY STATUSES
// --------------------------------------------------
export const getMyStatuses = async (req, res) => {
  try {
    const userId = req.user.id;

    const statuses = await Status.find({
      user: userId,
      isExpired: false,
    })
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statuses,
    });
  } catch (error) {
    console.log("GET MY STATUSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------------------------------------
// GET CONTACTS' STATUSES
// --------------------------------------------------
export const getContactStatuses = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all statuses from other users (not expired)
    const statuses = await Status.find({
      user: { $ne: userId },
      isExpired: false,
    })
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });

    // Group statuses by user
    const groupedStatuses = {};

    statuses.forEach((status) => {
      const userId = status.user._id.toString();
      if (!groupedStatuses[userId]) {
        groupedStatuses[userId] = {
          user: status.user,
          statuses: [],
          viewed: status.viewers.includes(req.user.id),
        };
      }

      // Check if this specific status has been viewed by current user
      const isViewed = status.viewers.includes(req.user.id);
      if (isViewed) {
        groupedStatuses[userId].viewed = true;
      }

      groupedStatuses[userId].statuses.push({
        _id: status._id,
        content: status.content,
        type: status.type,
        caption: status.caption,
        createdAt: status.createdAt,
        time: getTimeAgo(status.createdAt),
      });
    });

    // Convert to array and sort by most recent status
    const result = Object.values(groupedStatuses).map((group) => ({
      id: group.user._id,
      name: group.user.name,
      avatar: group.user.profilePic,
      statuses: group.statuses,
      viewed: group.viewed,
    }));

    return res.status(200).json({
      success: true,
      statuses: result,
    });
  } catch (error) {
    console.log("GET CONTACT STATUSES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------------------------------------
// VIEW STATUS
// --------------------------------------------------
export const viewStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { statusId } = req.params;

    const status = await Status.findById(statusId);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }

    // Add user to viewers if not already viewed
    if (!status.viewers.includes(userId)) {
      status.viewers.push(userId);
      await status.save();
    }

    return res.status(200).json({
      success: true,
      status,
    });
  } catch (error) {
    console.log("VIEW STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------------------------------------
// DELETE STATUS
// --------------------------------------------------
export const deleteStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { statusId } = req.params;

    const status = await Status.findById(statusId);

    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }

    // Check if user owns the status
    if (status.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this status",
      });
    }

    await Status.findByIdAndDelete(statusId);

    return res.status(200).json({
      success: true,
      message: "Status deleted successfully",
    });
  } catch (error) {
    console.log("DELETE STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// --------------------------------------------------
// HELPER: Get time ago string
// --------------------------------------------------
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}
