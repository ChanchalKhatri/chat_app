import React from "react";

import {
  X,
  ChevronRight,
  Bell,
  ShieldAlert,
  Lock,
  Trash2,
  Ban,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

const ContactInfo = ({ contact, onClose }) => {
  if (!contact) return null;

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col border-l border-[#313d45] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="w-full h-[60px] bg-[#202c33] px-4 flex items-center gap-6 border-b border-[#313d45] shrink-0">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-[#aebac1] hover:text-white hover:bg-[#374248] rounded-full"
        >
          <X size={22} />
        </Button>

        <span className="font-medium text-[16px]">Contact info</span>
      </div>

      {/* Scrollable Body */}
      <ScrollArea className="flex-1">
        {/* Main profile card */}
        <Card className="bg-[#0b141a] border-none rounded-none py-7 px-6 flex flex-col items-center shadow-none border-b-[10px] border-[#111b21]">
          <Avatar className="w-[150px] h-[150px] shadow-lg mb-4">
            <AvatarImage src={contact.image} alt={contact.name} />

            <AvatarFallback className="text-3xl bg-[#2a3942] text-white">
              {contact.name[0]}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-[20px] font-medium text-white text-center leading-tight">
            {contact.name}
          </h2>

          <p className="text-[#8696a0] text-sm mt-1 text-center">
            {contact.phone}
          </p>
        </Card>

        {/* About section */}
        <Card className="bg-[#0b141a] border-none rounded-none py-4 px-6 shadow-none border-b-[10px] border-[#111b21]">
          <p className="text-[#8696a0] text-sm mb-1">About</p>

          <p className="text-[15px] text-white leading-normal">
            {contact.about || "Available"}
          </p>
        </Card>

        {/* Media, links and docs */}
        <Card
          className={cn(
            "bg-[#0b141a] border-none rounded-none py-4 px-6 shadow-none border-b-[10px] border-[#111b21]",
            "flex items-center justify-between cursor-pointer hover:bg-[#202c33] transition-all duration-200",
          )}
        >
          <span className="text-[15px] text-white">Media, links and docs</span>

          <div className="flex items-center gap-1 text-[#8696a0]">
            <span className="text-sm">0</span>

            <ChevronRight size={18} />
          </div>
        </Card>

        {/* Actions List */}
        <Card className="bg-[#0b141a] border-none rounded-none shadow-none border-b-[10px] border-[#111b21]">
          {/* Mute notifications */}
          <div className="px-6 py-4 flex items-center justify-between hover:bg-[#202c33] transition cursor-pointer">
            <div className="flex items-center gap-4 text-[#aebac1]">
              <Bell size={20} />

              <span className="text-[15px] text-white">Mute notifications</span>
            </div>

            <ChevronRight size={18} className="text-[#8696a0]" />
          </div>

          <Separator className="bg-[#1f2c34]" />

          {/* Encryption */}
          <div className="px-6 py-4 flex items-center justify-between hover:bg-[#202c33] transition cursor-pointer">
            <div className="flex items-center gap-4 text-[#aebac1]">
              <Lock size={20} />

              <div>
                <span className="text-[15px] text-white block">Encryption</span>

                <span className="text-[12px] text-[#8696a0] block leading-tight">
                  Messages are end-to-end encrypted. Click to verify.
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Block / Report buttons */}
        <Card className="bg-[#0b141a] border-none rounded-none py-2 shadow-none">
          {/* Block contact */}
          <div className="px-6 py-4 flex items-center gap-4 text-red-500 hover:bg-[#202c33] transition cursor-pointer">
            <Ban size={20} />

            <span className="text-[15px]">Block {contact.name}</span>
          </div>

          {/* Report contact */}
          <div className="px-6 py-4 flex items-center gap-4 text-red-500 hover:bg-[#202c33] transition cursor-pointer">
            <ShieldAlert size={20} />

            <span className="text-[15px]">Report {contact.name}</span>
          </div>

          {/* Delete chat */}
          <div className="px-6 py-4 flex items-center gap-4 text-red-500 hover:bg-[#202c33] transition cursor-pointer">
            <Trash2 size={20} />

            <span className="text-[15px]">Delete chat</span>
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default ContactInfo;
