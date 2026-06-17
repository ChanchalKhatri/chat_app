"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

const OptionButton = ({
  icon: Icon,
  tooltip,
  isActive,
  onClick,
  hasNotification = false,
  notificationCount = 0,
}) => {
  return (
    <TooltipProvider delayDuration={120}>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClick}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105",
                isActive
                  ? "bg-[#374248] text-white hover:bg-[#374248] hover:text-white"
                  : "bg-transparent text-[#aebac1] hover:bg-[#2a3942] hover:text-white",
              )}
            >
              <Icon
                size={isActive ? 24 : 26}
                className={cn(
                  "transition-all duration-200",
                  isActive && "text-white",
                )}
              />
            </Button>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            sideOffset={10}
            className="bg-[#111b21] text-white border border-[#2a3942] shadow-lg"
          >
            {tooltip}
          </TooltipContent>
        </Tooltip>

        {hasNotification && notificationCount > 0 && (
          <Badge className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-[#00d95f] hover:bg-[#00d95f] text-black text-[11px] font-bold flex items-center justify-center pointer-events-none border border-[#1f2c34] shadow-sm">
            {notificationCount > 99 ? "99+" : notificationCount}
          </Badge>
        )}
      </div>
    </TooltipProvider>
  );
};

export default OptionButton;
