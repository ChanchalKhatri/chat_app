// chat/ChatMessages.jsx

import React from "react";

import MessageBubble from "./MessageBubble";

const WALLPAPER_COLORS = {
  "default": "#0b141a",
  "deep-blue": "#0a192f",
  "emerald": "#06221d",
  "purple": "#160721",
  "charcoal": "#161616",
  "burgundy": "#1f0308"
};

const ChatMessages = ({ messages, user, messagesEndRef }) => {
  const [bgStyle, setBgStyle] = React.useState({ backgroundColor: "#0b141a" });

  React.useEffect(() => {
    const updateWallpaper = () => {
      const wp = localStorage.getItem("wa_chat_wallpaper") || "default";
      const color = WALLPAPER_COLORS[wp] || "#0b141a";
      setBgStyle({ backgroundColor: color });
    };

    updateWallpaper();
    window.addEventListener("wa_wallpaper_updated", updateWallpaper);
    return () => window.removeEventListener("wa_wallpaper_updated", updateWallpaper);
  }, []);

  return (
    <div
      style={bgStyle}
      className="flex-1 overflow-y-auto min-h-0 px-6 py-4 custom-scrollbar transition-colors duration-300"
    >
      <div className="flex flex-col gap-3">
        {messages?.map((msg) => (
          <MessageBubble
            key={msg._id}
            text={msg.type === "text" ? msg.text : ""}
            file={msg.file}
            fileType={msg.type}
            sender={
              msg.sender === user?._id || msg.sender?._id === user?._id
                ? "me"
                : "other"
            }
            seen={msg.seen}
            delivered={msg.delivered}
            time={new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;

