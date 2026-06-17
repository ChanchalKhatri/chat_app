import { useEffect, useState } from "react";

import useAuthStore from "../store/authStore";

import socket from "@/lib/socket";

export const useSocket = (selectedItem) => {
  const { user } = useAuthStore();

  const [isTyping, setIsTyping] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedItem?.conversationId) {
      socket.emit("join-conversation", selectedItem.conversationId);
      console.log("Joined conversation room:", selectedItem.conversationId);

      return () => {
        socket.emit("leave-conversation", selectedItem.conversationId);
        console.log("Left conversation room:", selectedItem.conversationId);
      };
    }
  }, [selectedItem?.conversationId]);

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  useEffect(() => {
    const handleUserTyping = ({ userId }) => {
      if (userId === selectedItem?.contactUser) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = ({ userId }) => {
      if (userId === selectedItem?.contactUser) {
        setIsTyping(false);
      }
    };

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("user-typing", handleUserTyping);
      socket.off("user-stop-typing", handleUserStopTyping);
    };
  }, [selectedItem?.contactUser]);

  return {
    isTyping,
    onlineUsers,
    socket,
  };
};
