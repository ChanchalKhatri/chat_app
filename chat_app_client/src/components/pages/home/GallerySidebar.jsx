import React, { useState } from "react";
import { ArrowLeft, FileText, ExternalLink, Download, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { useGalleryData } from "../../../hooks/useGalleryData";

import Lightbox from "./Lightbox";

export default function GallerySidebar({
  onClose,
  selectedItem,
  messages = [],
}) {
  const [activeTab, setActiveTab] = useState("media");
  const [lightboxItem, setLightboxItem] = useState(null);

  const { mediaList, docList, linkList } = useGalleryData(messages);

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col overflow-hidden animate-in slide-in-from-left duration-300 border-r border-[#313d45]">
      {/* Header */}
      <div className="w-full h-[60px] bg-[#202c33] border-b border-[#313d45] flex items-center px-4 gap-4 shrink-0">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
        >
          <ArrowLeft size={24} />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold leading-tight">Gallery</h1>
          <span className="text-[12px] text-[#8696a0]">
            {selectedItem ? selectedItem.name : "Shared Media"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full bg-[#111b21] border-b border-[#222e35] flex shrink-0">
        <button
          onClick={() => setActiveTab("media")}
          className={`flex-1 py-3.5 text-center text-sm font-medium border-b-2 transition duration-200 ${
            activeTab === "media"
              ? "border-[#00a884] text-[#00a884]"
              : "border-transparent text-[#8696a0] hover:text-white"
          }`}
        >
          Media
        </button>
        <button
          onClick={() => setActiveTab("docs")}
          className={`flex-1 py-3.5 text-center text-sm font-medium border-b-2 transition duration-200 ${
            activeTab === "docs"
              ? "border-[#00a884] text-[#00a884]"
              : "border-transparent text-[#8696a0] hover:text-white"
          }`}
        >
          Docs
        </button>
        <button
          onClick={() => setActiveTab("links")}
          className={`flex-1 py-3.5 text-center text-sm font-medium border-b-2 transition duration-200 ${
            activeTab === "links"
              ? "border-[#00a884] text-[#00a884]"
              : "border-transparent text-[#8696a0] hover:text-white"
          }`}
        >
          Links
        </button>
      </div>

      {/* Content scroll area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Media Grid */}
          {activeTab === "media" && (
            <div className="grid grid-cols-3 gap-2">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="aspect-square bg-[#202c33] rounded-lg overflow-hidden relative cursor-pointer group shadow-md hover:ring-2 hover:ring-[#00a884] transition-all"
                >
                  <img
                    src={item.url}
                    alt="shared media"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                    <Eye size={20} className="text-white" />
                  </div>
                </div>
              ))}
              {mediaList.length === 0 && (
                <div className="col-span-3 text-center py-10 text-sm text-[#8696a0]">
                  No media shared in this chat
                </div>
              )}
            </div>
          )}

          {/* Documents List */}
          {activeTab === "docs" && (
            <div className="flex flex-col gap-2">
              {docList.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-[#202c33] hover:bg-[#2a3942] rounded-lg cursor-pointer transition shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#2b3a42] flex items-center justify-center text-[#00a884] shrink-0 border border-[#3c4a54]">
                      <FileText size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-white truncate pr-2">
                        {doc.name}
                      </span>
                      <span className="text-[12px] text-[#8696a0]">
                        {doc.size} • {doc.time}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#8696a0] hover:text-white rounded-full hover:bg-white/10 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (doc.url && doc.url !== "#") {
                        window.open(doc.url, "_blank");
                      }
                    }}
                  >
                    <Download size={18} />
                  </Button>
                </div>
              ))}
              {docList.length === 0 && (
                <div className="text-center py-10 text-sm text-[#8696a0]">
                  No documents shared in this chat
                </div>
              )}
            </div>
          )}

          {/* Links List */}
          {activeTab === "links" && (
            <div className="flex flex-col gap-2">
              {linkList.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 bg-[#202c33] hover:bg-[#2a3942] rounded-lg transition shadow-sm group"
                >
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="text-sm font-medium text-[#00a884] truncate group-hover:underline">
                      {link.title}
                    </span>
                    <span className="text-[11px] text-white/50 truncate mt-0.5">
                      {link.url}
                    </span>
                    <span className="text-[12px] text-[#8696a0] mt-1.5">
                      {link.time}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#00a884]/20 flex items-center justify-center text-[#8696a0] group-hover:text-[#00a884] transition shrink-0">
                    <ExternalLink size={14} />
                  </div>
                </a>
              ))}
              {linkList.length === 0 && (
                <div className="text-center py-10 text-sm text-[#8696a0]">
                  No links shared in this chat
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </div>
  );
}
