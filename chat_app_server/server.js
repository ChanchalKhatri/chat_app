import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/user.route.js";
import contactRoutes from "./routes/contact.route.js";
import messageRoutes from "./routes/message.routes.js";
import conversationRoute from "./routes/conversation.routes.js";
import statusRoutes from "./routes/status.route.js";

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Socket.io Setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store online users
let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their userId
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User joined:", userId);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  // Listen for typing events
  socket.on("typing", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("user-typing", { userId });
  });

  socket.on("stop-typing", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("user-stop-typing", { userId });
  });

  // Join conversation room
  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Leave conversation room
  socket.on("leave-conversation", (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on("disconnect", () => {
    // Remove user from online users
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers.keys()));
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);

app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversation", conversationRoute);
app.use("/api/status", statusRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
