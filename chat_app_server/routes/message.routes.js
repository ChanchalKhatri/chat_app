// routes/message.routes.js

import express from "express";

import protect from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { sendMessage, getMessages, clearMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", protect, upload.single("file"), sendMessage);

router.get("/:conversationId", protect, getMessages);

router.delete("/:conversationId/clear", protect, clearMessages);

export default router;
