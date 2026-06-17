// chat/ChatHeader.jsx

import React from "react";

import { Search, MoreVertical, Info, Trash2, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatHeader = ({
  selectedItem,
  onToggleContactInfo,
  onToggleSearchMessages,
  onClearMessages,
  onCloseChat,
  isTyping,
  onlineUsers,
}) => {
  // Check if selected user is online
  const isUserOnline = onlineUsers?.includes(selectedItem?.contactUser);

  return (
    <div className="w-full h-[60px] bg-[#202c33] border-b border-[#313d45] px-4 flex items-center justify-between shrink-0">
      {/* LEFT */}
      <div
        onClick={onToggleContactInfo}
        className="flex items-center gap-3 cursor-pointer"
      >
        {/* AVATAR */}
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={selectedItem?.profilePic}
            alt={selectedItem?.firstName}
          />

          <AvatarFallback className="bg-[#2a3942] text-white">
            {selectedItem?.firstName?.[0] || "U"}
          </AvatarFallback>
        </Avatar>

        {/* USER INFO */}
        <div className="flex flex-col">
          <h2 className="text-white text-[15px] font-medium leading-none">
            {selectedItem?.name}
          </h2>

          <span className="text-[#8696a0] text-xs mt-1">
            {isTyping ? "typing..." : isUserOnline ? "online" : "last seen recently"}
          </span>
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-1">
        {/* SEARCH */}
        <Button
          onClick={onToggleSearchMessages}
          variant="ghost"
          size="icon"
          className="hover:bg-[#2a3942] rounded-full"
        >
          <Search size={22} className="text-[#8696a0]" />
        </Button>

        {/* MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[#2a3942] rounded-full"
            >
              <MoreVertical size={22} className="text-[#8696a0]" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-[#202c33] border border-[#313d45] text-white w-52 mr-2">
            {/* CONTACT INFO */}
            <DropdownMenuItem
              onClick={onToggleContactInfo}
              className="cursor-pointer focus:bg-[#2a3942]"
            >
              <Info className="mr-2 h-4 w-4" />
              Contact info
            </DropdownMenuItem>

            {/* CLEAR */}
            <DropdownMenuItem
              onClick={onClearMessages}
              className="cursor-pointer focus:bg-[#2a3942]"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear messages
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#313d45]" />

            {/* CLOSE */}
            <DropdownMenuItem
              onClick={onCloseChat}
              className="cursor-pointer focus:bg-[#2a3942] text-red-400"
            >
              <X className="mr-2 h-4 w-4" />
              Close chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
