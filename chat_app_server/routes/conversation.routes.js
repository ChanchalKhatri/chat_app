import express from "express";

import {
  createOrGetConversation,
  getMyConversations,
} from "../controllers/conversation.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// CREATE OR GET
router.post("/create", protect, createOrGetConversation);

// GET ALL
router.get("/", protect, getMyConversations);

export default router;
