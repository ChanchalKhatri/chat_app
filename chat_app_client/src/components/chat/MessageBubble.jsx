// MessageBubble.jsx

import React from "react";

import { FileText, Download, Play, Check, CheckCheck, Mic } from "lucide-react";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

const MessageBubble = ({ text, time, sender, file, fileType, seen, delivered }) => {
  // SAFE DETECTION
  const isDocument = fileType === "document";

  const isMedia = fileType === "media";

  const isAudio = fileType === "audio";

  const isVideo = fileType === "video" || (isMedia && file && (file.includes(".mp4") || file.includes(".webm") || file.includes(".ogg") || file.includes(".mov")));

  const isImage = fileType === "image" || (isMedia && !isVideo);

  return (
    <div
      className={cn(
        "flex w-full",
        sender === "me" ? "justify-end" : "justify-start",
      )}
    >
      <Card
        className={cn(
          "max-w-[350px] border-0 shadow-md overflow-hidden  px-3 py-2",
          sender === "me"
            ? "bg-[#005c4b] text-white rounded-2xl rounded-br-sm"
            : "bg-[#202c33] text-white rounded-2xl rounded-bl-sm",
        )}
      >
        {/* IMAGE */}
        {isImage && file && (
          <div className="overflow-hidden rounded-xl">
            <img
              src={encodeURI(file)}
              alt="media"
              className="w-full max-h-[320px] object-cover rounded-xl p-0"
            />
          </div>
        )}

        {/* VIDEO */}
        {isVideo && file && (
          <div className="mb-2 overflow-hidden rounded-xl bg-black relative">
            <video controls className="w-full rounded-xl">
              <source src={encodeURI(file)} />
            </video>

            <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-full">
              <Play size={14} />
            </div>
          </div>
        )}

        {/* AUDIO */}
        {isAudio && file && (
          <div className="mb-2 overflow-hidden rounded-xl bg-[#111b21] p-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#00a884] p-2 rounded-full shrink-0">
                <Mic size={18} className="text-white" />
              </div>
              <audio controls className="flex-1 h-8">
                <source src={encodeURI(file)} />
              </audio>
            </div>
          </div>
        )}

        {/* DOCUMENT */}
        {isDocument && file && (
          <a
            href={encodeURI(file)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 bg-[#111b21] rounded-xl p-3 mb-2 hover:bg-[#1f2c34] transition-all duration-200"
          >
            {/* ICON */}
            <div className="bg-[#2a3942] p-2 rounded-lg shrink-0">
              <FileText size={22} />
            </div>

            {/* INFO */}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm truncate font-medium">
                {text || "Document"}
              </p>

              <span className="text-xs text-[#8696a0]">Click to open</span>
            </div>

            {/* DOWNLOAD */}
            <Download size={18} className="shrink-0" />
          </a>
        )}

        {/* TEXT */}
        {text && fileType === "text" && (
          <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
            {text}
          </p>
        )}

        {/* CAPTION */}
        {text && (isImage || isVideo) && (
          <p className="text-sm break-words whitespace-pre-wrap mt-1">{text}</p>
        )}

        {/* TIME */}
        <div className="flex justify-end items-center gap-1">
          {sender === "me" && (
            <>
              {seen ? (
                <CheckCheck size={14} className="text-[#53bdeb]" />
              ) : delivered ? (
                <CheckCheck size={14} className="text-[#d1d7db]" />
              ) : (
                <Check size={14} className="text-[#d1d7db]" />
              )}
            </>
          )}
          <span className="text-[10px] text-[#d1d7db]">{time}</span>
        </div>
      </Card>
    </div>
  );
};

export default MessageBubble;
