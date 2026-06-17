// routes/contact.routes.js

import express from "express";
import {
  addContacts,
  getMyContacts,
} from "../controllers/contact.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addContacts);

router.get("/", protect, getMyContacts);

export default router;
