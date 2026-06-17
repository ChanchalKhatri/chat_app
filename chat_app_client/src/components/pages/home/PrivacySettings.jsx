import React, { useState, useEffect } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function PrivacySettings({ onBack }) {
  const [lastSeen, setLastSeen] = useState("everyone");
  const [profilePhoto, setProfilePhoto] = useState("everyone");
  const [about, setAbout] = useState("contacts");
  const [readReceipts, setReadReceipts] = useState(true);

  // Load from localStorage
  useEffect(() => {
    setLastSeen(localStorage.getItem("wa_priv_last_seen") || "everyone");
    setProfilePhoto(localStorage.getItem("wa_priv_profile_photo") || "everyone");
    setAbout(localStorage.getItem("wa_priv_about") || "contacts");
    setReadReceipts(localStorage.getItem("wa_priv_read_receipts") !== "false");
  }, []);

  const saveSetting = (key, value) => {
    localStorage.setItem(key, value);
  };

  const toggleReadReceipts = () => {
    const newVal = !readReceipts;
    setReadReceipts(newVal);
    saveSetting("wa_priv_read_receipts", newVal.toString());
  };

  const handleLastSeenChange = (val) => {
    setLastSeen(val);
    saveSetting("wa_priv_last_seen", val);
  };

  const handleProfilePhotoChange = (val) => {
    setProfilePhoto(val);
    saveSetting("wa_priv_profile_photo", val);
  };

  const handleAboutChange = (val) => {
    setAbout(val);
    saveSetting("wa_priv_about", val);
  };

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="w-full h-[60px] bg-[#202c33] border-b border-[#313d45] flex items-center px-4 gap-4 shrink-0">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-xl font-semibold">Privacy</h1>
      </div>

      <ScrollArea className="flex-1 bg-[#111b21]">
        <div className="py-4 px-6 flex flex-col gap-6">
          {/* Intro Icon */}
          <div className="flex items-center gap-4 py-2 text-[#00a884]">
            <Shield size={32} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Your privacy is important</span>
              <span className="text-[12px] text-[#8696a0]">Manage who can see your personal info.</span>
            </div>
          </div>

          <Separator className="bg-[#222e35]" />

          {/* Last Seen */}
          <div>
            <h3 className="text-[#00a884] text-xs font-semibold uppercase tracking-wider mb-3">
              Last seen & online
            </h3>
            <div className="flex flex-col gap-3.5 bg-[#0b141a] p-4 rounded-xl border border-[#222e35]">
              {["everyone", "contacts", "nobody"].map((option) => (
                <label key={option} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm capitalize group-hover:text-[#00a884] transition">
                    {option === "contacts" ? "My Contacts" : option}
                  </span>
                  <input
                    type="radio"
                    name="lastSeen"
                    value={option}
                    checked={lastSeen === option}
                    onChange={() => handleLastSeenChange(option)}
                    className="w-4.5 h-4.5 accent-[#00a884] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <h3 className="text-[#00a884] text-xs font-semibold uppercase tracking-wider mb-3">
              Profile photo
            </h3>
            <div className="flex flex-col gap-3.5 bg-[#0b141a] p-4 rounded-xl border border-[#222e35]">
              {["everyone", "contacts", "nobody"].map((option) => (
                <label key={option} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm capitalize group-hover:text-[#00a884] transition">
                    {option === "contacts" ? "My Contacts" : option}
                  </span>
                  <input
                    type="radio"
                    name="profilePhoto"
                    value={option}
                    checked={profilePhoto === option}
                    onChange={() => handleProfilePhotoChange(option)}
                    className="w-4.5 h-4.5 accent-[#00a884] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[#00a884] text-xs font-semibold uppercase tracking-wider mb-3">
              About
            </h3>
            <div className="flex flex-col gap-3.5 bg-[#0b141a] p-4 rounded-xl border border-[#222e35]">
              {["everyone", "contacts", "nobody"].map((option) => (
                <label key={option} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm capitalize group-hover:text-[#00a884] transition">
                    {option === "contacts" ? "My Contacts" : option}
                  </span>
                  <input
                    type="radio"
                    name="about"
                    value={option}
                    checked={about === option}
                    onChange={() => handleAboutChange(option)}
                    className="w-4.5 h-4.5 accent-[#00a884] cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Read Receipts */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Read receipts</span>
              <button
                onClick={toggleReadReceipts}
                className={`w-11 h-6 rounded-full transition-colors relative duration-200 focus:outline-none ${
                  readReceipts ? "bg-[#00a884]" : "bg-[#374248]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                    readReceipts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-[12px] text-[#8696a0] leading-normal mt-1">
              If turned off, you won't send or receive Read receipts. Read receipts are always sent for group chats.
            </p>
          </div>

          {/* Blocked Contacts Link */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex items-center justify-between cursor-pointer hover:bg-[#202c33] transition">
            <div className="flex flex-col">
              <span className="text-sm">Blocked contacts</span>
              <span className="text-xs text-[#8696a0] mt-0.5">None</span>
            </div>
            <span className="text-xs text-[#00a884] font-medium">Manage</span>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
