"use client";

import { MessageSquareText, CircleDashed, Image, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

import OptionButton from "./OptionButton";

import useAuthStore from "@/store/authStore";

export default function OptionBar({
  activeMenu,
  setActiveMenu,
  setSelectedItem,
  chats,
}) {
  const { user } = useAuthStore();

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setSelectedItem(null);
  };

  // Calculate notification count based on actual chats
  const notificationCount = chats?.length || 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="w-[72px] h-screen bg-[#1f2c34] border-r border-[#313d45] flex flex-col items-center justify-between py-3 shrink-0">
        {/* Top Section */}
        <div className="flex flex-col items-center gap-5">
          {/* Chats */}
          <OptionButton
            icon={MessageSquareText}
            tooltip="Chats"
            isActive={activeMenu === "chat"}
            onClick={() => handleMenuClick("chat")}
            hasNotification={notificationCount > 0}
            notificationCount={notificationCount}
          />

          {/* Status */}
          <OptionButton
            icon={CircleDashed}
            tooltip="Status"
            isActive={activeMenu === "status"}
            onClick={() => handleMenuClick("status")}
          />

          <Separator className="w-10 bg-[#3b4a54]" />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-5">
          {/* Gallery */}
          <OptionButton
            icon={Image}
            tooltip="Gallery"
            isActive={activeMenu === "gallery"}
            onClick={() => handleMenuClick("gallery")}
          />

          {/* Settings */}
          <OptionButton
            icon={Settings}
            tooltip="Settings"
            isActive={activeMenu === "settings"}
            onClick={() => handleMenuClick("settings")}
          />

          {/* Profile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => handleMenuClick("profile")}
                className="cursor-pointer"
              >
                <Avatar
                  className={cn(
                    "w-11 h-11 border transition-all duration-200 hover:scale-105",
                    activeMenu === "profile"
                      ? "border-[#00a884] ring-2 ring-[#00a884]/20"
                      : "border-[#3b4a54]",
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
              </div>
            </TooltipTrigger>

            <TooltipContent
              side="right"
              sideOffset={10}
              className="bg-[#111b21] text-white border border-[#2a3942] shadow-lg"
            >
              Profile
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
