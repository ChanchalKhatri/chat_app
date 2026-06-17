// chat/AttachmentMenu.jsx

import React from "react";

import { Paperclip, Image, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AttachmentMenu = ({ imageInputRef, docInputRef }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-[#2a3942]">
          <Paperclip className="text-[#8696a0]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-[#202c33] border-[#313d45] text-white">
        <DropdownMenuItem onClick={() => imageInputRef.current.click()}>
          <Image className="mr-2 h-4 w-4" />
          Photos & Videos
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => docInputRef.current.click()}>
          <FileText className="mr-2 h-4 w-4" />
          Document
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => docInputRef.current.click()}>
          <FileText className="mr-2 h-4 w-4" />
          Audio
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AttachmentMenu;
