import React, { useState } from "react";

import { Search, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

import ChatItem from "../pages/home/ChatItem";

import NewContactModal from "./NewContactModal";
import useAuthStore from "@/store/authStore";

const Sidebar = ({
  activeMenu,
  selectedItem,
  setSelectedItem,
  chats,
  setChats,
  setActiveMenu,
}) => {
  const { user } = useAuthStore();

  // Search State
  const [search, setSearch] = useState("");

  // Modal State
  const [openModal, setOpenModal] = useState(false);

  // Filter Chats
  const filteredChats = chats.filter((chat) =>
    chat?.name?.toLowerCase()?.includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="w-full max-w-[380px] h-screen bg-[#111b21] border-r border-[#313d45] flex flex-col shrink-0 relative">
        {/* Header */}
        <nav className="w-full h-[60px] bg-[#202c33] px-4 flex items-center justify-between border-b border-[#313d45]">
          <h1 className="text-white text-xl font-semibold tracking-wide">
            Chats
          </h1>

          {/* Profile */}
          <Avatar
            onClick={() => {
              setActiveMenu("profile");
              setSelectedItem(null);
            }}
            className={cn(
              "w-10 h-10 cursor-pointer transition-all duration-200 hover:scale-105 border border-[#313d45]",
            )}
          >
            <AvatarImage
              src={
                user?.profilePic ||
                "https://ui-avatars.com/api/?name=User&background=ede9fe&color=7c3aed"
              }
              alt="profile"
            />

            <AvatarFallback className="bg-[#2a3942] text-white">
              {user?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </nav>

        {/* Search */}
        <div className="p-3 bg-[#111b21]">
          <div className="w-full h-11 bg-[#202c33] rounded-lg flex items-center px-3 gap-3">
            <Search size={18} className="text-[#8696a0] shrink-0" />

            <Input
              type="search"
              name="search"
              placeholder="Search or start new chat"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-0 shadow-none text-white placeholder:text-[#8696a0] w-full text-sm h-full px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <Separator className="bg-[#313d45]" />

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  selectedItem={selectedItem}
                  onClick={() => setSelectedItem(chat)}
                />
              ))
            ) : (
              <div className="text-center text-[#8696a0] mt-10 text-sm px-4">
                No chats found
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Floating WhatsApp Button */}
        <button
          onClick={() => setOpenModal(true)}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl bg-[#00a884] hover:bg-[#02bd95] flex items-center justify-center shadow-[0_8px_30px_rgba(0,168,132,0.45)] transition-all duration-300 hover:scale-105"
        >
          <Plus size={28} className="text-white" />
        </button>
      </div>

      {/* Modal */}
      <NewContactModal
        open={openModal}
        setOpen={setOpenModal}
        chats={chats}
        setChats={setChats}
      />
    </>
  );
};

export default Sidebar;
