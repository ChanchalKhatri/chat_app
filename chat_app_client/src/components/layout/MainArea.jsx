// MainArea.jsx

import React, { useEffect, useState } from "react";

import ChatHeader from "../chat/ChatHeader";

import ChatMessages from "../chat/ChatMessages";

import ChatInput from "../chat/ChatInput";

import EmojiPickerBox from "../chat/EmojiPickerBox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import useAuthStore from "../../store/authStore";

import { useSocket } from "../../hooks/useSocket";

import { useMessageOperations } from "../../hooks/useMessageOperations";

import socket from "@/lib/socket";

const MainArea = ({
  selectedItem,
  setChats,
  onToggleContactInfo,
  onToggleSearchMessages,
  onClearMessages,
  onCloseChat,
  rightSidebar,
  onMessagesChange,
}) => {
  const { user } = useAuthStore();

  const [messageText, setMessageText] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { isTyping, onlineUsers } = useSocket(selectedItem);

  const {
    messages,
    messagesEndRef,
    showClearConfirm,
    handleSend,
    handleFileUpload,
    handleClearMessages,
    confirmClearMessages,
    cancelClearMessages,
  } = useMessageOperations(
    selectedItem,
    setChats,
    onMessagesChange,
    rightSidebar,
  );

  const handleEmojiClick = (emojiObject) => {
    setMessageText((prev) => prev + emojiObject.emoji);

    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (messageText && selectedItem?.conversationId) {
      socket.emit("typing", {
        conversationId: selectedItem.conversationId,
        userId: user._id,
      });

      const timeout = setTimeout(() => {
        socket.emit("stop-typing", {
          conversationId: selectedItem.conversationId,
          userId: user._id,
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [messageText, selectedItem?.conversationId, user._id]);

  const onSend = () => {
    handleSend(messageText, setMessageText);
  };

  // EMPTY STATE
  if (!selectedItem) {
    return (
      <div className="flex-1 h-screen bg-[#0b141a] flex items-center justify-center text-[#8696a0]">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-[#0b141a] flex flex-col relative overflow-hidden">
      <ChatHeader
        selectedItem={selectedItem}
        onToggleContactInfo={onToggleContactInfo}
        onToggleSearchMessages={onToggleSearchMessages}
        onClearMessages={handleClearMessages}
        onCloseChat={onCloseChat}
        isTyping={isTyping}
        onlineUsers={onlineUsers}
      />

      <ChatMessages
        messages={messages}
        user={user}
        messagesEndRef={messagesEndRef}
      />

      {showEmojiPicker && <EmojiPickerBox onEmojiClick={handleEmojiClick} />}

      {/* CLEAR MESSAGES CONFIRMATION DIALOG */}
      <Dialog open={showClearConfirm} onOpenChange={cancelClearMessages}>
        <DialogContent className="bg-[#202c33] border-[#313d45] text-white">
          <DialogHeader>
            <DialogTitle>Clear Messages</DialogTitle>
            <DialogDescription className="text-[#8696a0]">
              Are you sure you want to clear all messages in this chat? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelClearMessages}
              className="bg-[#2a3942] text-white border-[#313d45] hover:bg-[#374248]"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmClearMessages}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Clear Messages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChatInput
        messageText={messageText}
        setMessageText={setMessageText}
        onSend={onSend}
        onFileUpload={handleFileUpload}
        onToggleEmoji={() => setShowEmojiPicker(!showEmojiPicker)}
      />
    </div>
  );
};

export default MainArea;
