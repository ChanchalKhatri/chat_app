import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  Bell,
  Lock,
  Image,
  LogOut,
  ChevronRight,
  Keyboard,
  Info,
  Check
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useAuthStore from "@/store/authStore";

// Sub-components
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";

const WALLPAPERS = [
  { id: "default", name: "Default WhatsApp", color: "#0b141a" },
  { id: "deep-blue", name: "Deep Ocean Blue", color: "#0a192f" },
  { id: "emerald", name: "Classic Forest", color: "#06221d" },
  { id: "purple", name: "Royal Purple", color: "#160721" },
  { id: "charcoal", name: "Midnight Charcoal", color: "#161616" },
  { id: "burgundy", name: "Dark Velvet", color: "#1f0308" }
];

export default function SettingsSidebar({ onClose, onGoToProfile }) {
  const { user, logout } = useAuthStore();
  const [currentScreen, setCurrentScreen] = useState(null); // privacy | notifications | security | wallpaper | shortcuts
  const [activeWallpaper, setActiveWallpaper] = useState("default");

  useEffect(() => {
    setActiveWallpaper(localStorage.getItem("wa_chat_wallpaper") || "default");
  }, []);

  const handleWallpaperChange = (wpId) => {
    setActiveWallpaper(wpId);
    localStorage.setItem("wa_chat_wallpaper", wpId);
    // Broadcast an event so other components (like ChatMessages) know to update instantly
    window.dispatchEvent(new Event("wa_wallpaper_updated"));
  };

  // Render sub-screens
  if (currentScreen === "privacy") {
    return <PrivacySettings onBack={() => setCurrentScreen(null)} />;
  }

  if (currentScreen === "notifications") {
    return <NotificationSettings onBack={() => setCurrentScreen(null)} />;
  }

  if (currentScreen === "security") {
    return <SecuritySettings onBack={() => setCurrentScreen(null)} />;
  }

  if (currentScreen === "wallpaper") {
    return (
      <div className="w-full h-full bg-[#111b21] text-white flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="w-full h-[60px] bg-[#202c33] border-b border-[#313d45] flex items-center px-4 gap-4 shrink-0">
          <Button
            onClick={() => setCurrentScreen(null)}
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold">Chat Wallpaper</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-5 flex flex-col gap-4">
            <p className="text-sm text-[#8696a0] mb-2 leading-normal">
              Select a solid background theme color for your chat conversations:
            </p>
            <div className="flex flex-col gap-2.5">
              {WALLPAPERS.map((wp) => (
                <div
                  key={wp.id}
                  onClick={() => handleWallpaperChange(wp.id)}
                  className="flex items-center justify-between p-3.5 bg-[#202c33] hover:bg-[#2a3942] rounded-xl cursor-pointer transition border border-[#222e35]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full border border-white/20"
                      style={{ backgroundColor: wp.color }}
                    />
                    <span className="text-sm font-medium">{wp.name}</span>
                  </div>
                  {activeWallpaper === wp.id && <Check size={18} className="text-[#00a884] stroke-[3]" />}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (currentScreen === "shortcuts") {
    const shortcuts = [
      { keys: "Ctrl + Alt + N", desc: "Start a new conversation" },
      { keys: "Ctrl + Alt + /", desc: "Search through conversations" },
      { keys: "Ctrl + Alt + E", desc: "Toggle emoji picker box" },
      { keys: "Ctrl + Alt + P", desc: "Open profile page" },
      { keys: "Ctrl + Alt + S", desc: "Open settings panel" }
    ];
    return (
      <div className="w-full h-full bg-[#111b21] text-white flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="w-full h-[60px] bg-[#202c33] border-b border-[#313d45] flex items-center px-4 gap-4 shrink-0">
          <Button
            onClick={() => setCurrentScreen(null)}
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold">Shortcuts</h1>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-5 flex flex-col gap-4">
            <h3 className="text-[#00a884] text-xs font-semibold uppercase tracking-wider mb-2">
              Keyboard Shortcuts
            </h3>
            <div className="flex flex-col gap-3">
              {shortcuts.map((sc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-[#0b141a] rounded-xl border border-[#222e35]"
                >
                  <span className="text-sm text-[#8696a0] pr-2">{sc.desc}</span>
                  <kbd className="bg-[#202c33] px-2.5 py-1 rounded text-xs font-semibold font-mono text-[#00a884] border border-[#313d45] whitespace-nowrap">
                    {sc.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
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
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <ScrollArea className="flex-1 bg-[#111b21]">
        {/* User Card */}
        <div
          onClick={onGoToProfile}
          className="flex items-center gap-4 p-5 hover:bg-[#202c33] cursor-pointer transition border-b border-[#222e35]"
        >
          <Avatar className="w-14 h-14">
            <AvatarImage
              src={
                user?.profilePic ||
                "https://ui-avatars.com/api/?name=User&background=ede9fe&color=7c3aed"
              }
              alt="user profile"
            />
            <AvatarFallback className="bg-[#2a3942] text-xl text-white">
              {user?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-base truncate">{user?.name || "User"}</span>
            <span className="text-xs text-[#8696a0] truncate mt-0.5">
              {user?.description || "Hey there 👋"}
            </span>
          </div>
          <ChevronRight className="text-[#8696a0] shrink-0" size={18} />
        </div>

        {/* Settings Links */}
        <div className="p-3 flex flex-col gap-0.5">
          {/* Privacy */}
          <div
            onClick={() => setCurrentScreen("privacy")}
            className="flex items-center justify-between p-3.5 hover:bg-[#202c33] rounded-xl cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <Shield className="text-[#8696a0]" size={20} />
              <span className="text-sm font-medium">Privacy</span>
            </div>
            <ChevronRight className="text-[#8696a0]" size={16} />
          </div>

          {/* Notifications */}
          <div
            onClick={() => setCurrentScreen("notifications")}
            className="flex items-center justify-between p-3.5 hover:bg-[#202c33] rounded-xl cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <Bell className="text-[#8696a0]" size={20} />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <ChevronRight className="text-[#8696a0]" size={16} />
          </div>

          {/* Security */}
          <div
            onClick={() => setCurrentScreen("security")}
            className="flex items-center justify-between p-3.5 hover:bg-[#202c33] rounded-xl cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <Lock className="text-[#8696a0]" size={20} />
              <span className="text-sm font-medium">Security</span>
            </div>
            <ChevronRight className="text-[#8696a0]" size={16} />
          </div>

          {/* Chat Wallpaper */}
          <div
            onClick={() => setCurrentScreen("wallpaper")}
            className="flex items-center justify-between p-3.5 hover:bg-[#202c33] rounded-xl cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <Image className="text-[#8696a0]" size={20} />
              <span className="text-sm font-medium">Chat Wallpaper</span>
            </div>
            <ChevronRight className="text-[#8696a0]" size={16} />
          </div>

          {/* Keyboard Shortcuts */}
          <div
            onClick={() => setCurrentScreen("shortcuts")}
            className="flex items-center justify-between p-3.5 hover:bg-[#202c33] rounded-xl cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <Keyboard className="text-[#8696a0]" size={20} />
              <span className="text-sm font-medium">Keyboard Shortcuts</span>
            </div>
            <ChevronRight className="text-[#8696a0]" size={16} />
          </div>

          <Separator className="bg-[#222e35] my-2" />

          {/* Logout */}
          <div
            onClick={logout}
            className="flex items-center justify-between p-3.5 hover:bg-red-500/10 text-red-500 rounded-xl cursor-pointer transition font-medium"
          >
            <div className="flex items-center gap-4">
              <LogOut size={20} />
              <span className="text-sm font-semibold">Log Out</span>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
export { WALLPAPERS };
