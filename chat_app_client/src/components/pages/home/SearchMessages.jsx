import React, { useState } from "react";

import { X, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

import useAuthStore from "@/store/authStore";

const SearchMessages = ({ contact, messages, onClose }) => {
  const { user } = useAuthStore();
  const [query, setQuery] = useState("");

  if (!contact) return null;

  // Filter messages based on search query
  const matchingMessages =
    messages?.filter((msg) =>
      msg.text?.toLowerCase().includes(query.toLowerCase()),
    ) || [];

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col border-l border-[#313d45] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="w-full h-[60px] bg-[#202c33] px-4 flex items-center gap-6 border-b border-[#313d45] shrink-0">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
        >
          <X size={22} />
        </Button>

        <span className="font-medium text-[16px]">Search messages</span>
      </div>

      {/* Search Bar Input */}
      <div className="p-3 bg-[#111b21] shrink-0">
        <div className="w-full h-10 bg-[#202c33] rounded-lg flex items-center px-3 gap-3 border border-[#313d45]/30 focus-within:border-[#00a884] transition-colors">
          <Search size={16} className="text-[#8696a0] shrink-0" />

          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none border-none text-white placeholder:text-[#8696a0] w-full text-sm focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-full shadow-none"
            autoFocus
          />
        </div>
      </div>

      <Separator className="bg-[#1f2c34]" />

      {/* Message List */}
      <ScrollArea className="flex-1 px-4 py-2">
        {query.trim() === "" ? (
          <div className="text-center text-[#8696a0] text-sm mt-10 px-6">
            Search for messages with {contact.name}.
          </div>
        ) : matchingMessages.length > 0 ? (
          <div className="flex flex-col gap-2 pb-4">
            <Badge
              variant="secondary"
              className="w-fit bg-[#202c33] text-[#8696a0] hover:bg-[#202c33] px-2 py-1 text-[12px] font-medium rounded-md"
            >
              {matchingMessages.length} messages found
            </Badge>

            {matchingMessages.map((msg) => {
              const isMe =
                msg.sender === user?._id ||
                msg.sender?._id === user?._id ||
                msg.sender === "me";

              const time = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <Card
                  key={msg._id || msg.id}
                  className="bg-[#202c33] p-3 rounded-lg border border-[#313d45]/40 hover:bg-[#2a3942] transition cursor-pointer shadow-none"
                >
                  <div className="flex justify-between items-center mb-1 gap-3">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isMe ? "text-[#00a884]" : "text-purple-400",
                      )}
                    >
                      {isMe ? "You" : contact.name}
                    </span>

                    <span className="text-[10px] text-[#8696a0] shrink-0">
                      {time}
                    </span>
                  </div>

                  <p className="text-sm text-[#d1d7db] leading-relaxed break-words">
                    {msg.text}
                  </p>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-[#8696a0] text-sm mt-10">
            No messages found
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default SearchMessages;
