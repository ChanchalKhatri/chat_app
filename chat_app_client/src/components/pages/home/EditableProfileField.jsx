import React, { useState } from "react";

import { Pencil, Check } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const EditableProfileField = ({ label, value, onSave, description }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    if (onSave) {
      onSave(currentValue);
    }

    setIsEditing(false);
  };

  return (
    <div className="px-6 py-4 hover:bg-[#202c33] transition border-b border-[#1f2c34]">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <p className="text-[#00a884] text-sm mb-1">{label}</p>

          {isEditing ? (
            <Input
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              className={cn(
                "h-8 w-full bg-transparent border-0 border-b-2 border-[#00a884]",
                "rounded-none px-0 text-[15px] outline-none text-white",
                "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00a884]",
                "shadow-none",
              )}
              autoFocus
            />
          ) : (
            <h3 className="text-[15px] text-white">{value}</h3>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="cursor-pointer p-1 rounded-full hover:bg-[#2a3942]"
        >
          {isEditing ? (
            <Check size={20} className="text-[#00a884]" />
          ) : (
            <Pencil size={18} className="text-[#8696a0]" />
          )}
        </Button>
      </div>

      {description && !isEditing && (
        <p className="text-xs text-[#8696a0] mt-2">{description}</p>
      )}
    </div>
  );
};

export default EditableProfileField;
