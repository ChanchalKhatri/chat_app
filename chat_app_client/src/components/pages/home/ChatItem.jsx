// ChatItem.jsx

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

const ChatItem = ({ chat, selectedItem, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-200 border-b border-[#1f2c34]",
        selectedItem?.id === chat.id ? "bg-[#2a3942]" : "hover:bg-[#202c33]",
      )}
    >
      {/* PROFILE */}
      <Avatar className="w-12 h-12 shrink-0">
        <AvatarImage src={chat.image} alt={chat.name} />

        <AvatarFallback className="bg-[#2a3942] text-white">
          {chat.name[0]}
        </AvatarFallback>
      </Avatar>

      {/* CONTENT */}
      <div className="flex-1 min-w-0">
        {/* TOP */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-white text-[15px] font-medium truncate">
            {chat.name}
          </h2>

          <span className="text-[11px] text-[#8696a0] shrink-0">
            {chat.time}
          </span>
        </div>

        {/* MESSAGE */}
        <p className="text-sm text-[#aebac1] truncate mt-[2px]">
          {chat.message}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
