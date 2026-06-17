import { useEffect, useState, useRef, useCallback } from "react";

import {
  sendMessageApi,
  getMessagesApi,
  clearMessagesApi,
} from "../api/message.api";

import useAuthStore from "../store/authStore";

import socket from "@/lib/socket";

export const useMessageOperations = (
  selectedItem,
  setChats,
  onMessagesChange,
  rightSidebar,
) => {
  const { user } = useAuthStore();

  const [messages, setMessages] = useState([]);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("Received new message:", message);
      if (message.conversationId === selectedItem?.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [selectedItem?.conversationId]);

  useEffect(() => {
    const handleMessagesSeen = ({ conversationId, userId }) => {
      if (conversationId === selectedItem?.conversationId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === user._id ? { ...msg, seen: true } : msg,
          ),
        );
      }
    };

    socket.on("messages-seen", handleMessagesSeen);

    return () => {
      socket.off("messages-seen", handleMessagesSeen);
    };
  }, [selectedItem?.conversationId, user._id]);

  useEffect(() => {
    const handleMessagesCleared = ({ conversationId }) => {
      if (conversationId === selectedItem?.conversationId) {
        setMessages([]);
        if (selectedItem?.id) {
          setChats((prev) =>
            prev.map((c) =>
              c.id === selectedItem.id
                ? {
                    ...c,
                    message: "",
                    time: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  }
                : c,
            ),
          );
        }
      }
    };

    socket.on("messages-cleared", handleMessagesCleared);

    return () => {
      socket.off("messages-cleared", handleMessagesCleared);
    };
  }, [selectedItem?.conversationId, selectedItem?.id]);

  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (!selectedItem?.conversationId) {
          setMessages([]);

          return;
        }

        const res = await getMessagesApi(selectedItem.conversationId);

        setMessages(res.messages || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadMessages();
  }, [selectedItem]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [messages, rightSidebar]);

  const updateSidebar = useCallback(
    (message) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedItem.id
            ? {
                ...c,
                message,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : c,
        ),
      );
    },
    [selectedItem?.id],
  );

  const handleSend = useCallback(
    async (messageText, setMessageText) => {
      if (!messageText.trim()) return;

      try {
        const res = await sendMessageApi({
          conversationId: selectedItem.conversationId,

          receiverId: selectedItem.contactUser,

          text: messageText,

          type: "text",
        });

        setMessages((prev) => [...prev, res.message]);

        updateSidebar(messageText);

        setMessageText("");
      } catch (error) {
        console.log(error);
      }
    },
    [selectedItem?.conversationId, selectedItem?.contactUser, updateSidebar],
  );

  const handleFileUpload = useCallback(
    async (file, type) => {
      try {
        const formData = new FormData();

        formData.append("file", file);

        formData.append("conversationId", selectedItem.conversationId);

        formData.append("receiverId", selectedItem.contactUser);

        formData.append("type", type);

        const res = await sendMessageApi(formData);

        setMessages((prev) => [...prev, res.message]);

        let preview;
        if (type === "audio") {
          preview = "🎤 Voice message";
        } else if (type === "document") {
          preview = "📄 Document";
        } else if (type === "video") {
          preview = "🎥 Video";
        } else if (type === "image") {
          preview = "📷 Photo";
        } else {
          preview = "📎 Attachment";
        }

        updateSidebar(preview);
      } catch (error) {
        console.log(error);
      }
    },
    [selectedItem?.conversationId, selectedItem?.contactUser, updateSidebar],
  );

  const handleClearMessages = useCallback(async () => {
    setShowClearConfirm(true);
  }, []);

  const confirmClearMessages = useCallback(async () => {
    try {
      await clearMessagesApi(selectedItem.conversationId);
      setMessages([]);
      updateSidebar("");
      setShowClearConfirm(false);
    } catch (error) {
      console.log("Clear messages error:", error);
    }
  }, [selectedItem?.conversationId, updateSidebar]);

  const cancelClearMessages = useCallback(() => {
    setShowClearConfirm(false);
  }, []);

  return {
    messages,
    setMessages,
    messagesEndRef,
    showClearConfirm,
    handleSend,
    handleFileUpload,
    handleClearMessages,
    confirmClearMessages,
    cancelClearMessages,
  };
};
