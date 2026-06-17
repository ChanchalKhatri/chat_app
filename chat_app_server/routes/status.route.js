// routes/status.route.js

import express from "express";

import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  createStatus,
  getMyStatuses,
  getContactStatuses,
  viewStatus,
  deleteStatus,
} from "../controllers/status.controller.js";

const router = express.Router();

// Create a new status (with file upload support)
router.post("/create", protect, upload.single("file"), createStatus);

// Get my statuses
router.get("/my", protect, getMyStatuses);

// Get contacts' statuses
router.get("/contacts", protect, getContactStatuses);

// View a status (mark as viewed)
router.post("/:statusId/view", protect, viewStatus);

// Delete a status
router.delete("/:statusId", protect, deleteStatus);

export default router;
