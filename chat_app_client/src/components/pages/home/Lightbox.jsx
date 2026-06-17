import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Lightbox({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#080f14]/95 flex flex-col justify-between items-center p-4 animate-in fade-in duration-200">
      <div className="w-full flex justify-between items-center text-white max-w-[900px] z-10">
        <span className="text-sm font-medium">{item.time}</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={onClose}
        >
          <X size={24} />
        </Button>
      </div>

      <div className="flex-1 w-full flex items-center justify-center py-6">
        <img
          src={item.url}
          alt="Lightbox Media"
          className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
        />
      </div>

      <div className="h-8" />
    </div>
  );
}
