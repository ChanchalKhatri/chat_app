import React, { useState, useEffect } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings({ onBack }) {
  const [convTones, setConvTones] = useState(true);
  const [highPriority, setHighPriority] = useState(true);
  const [reactionNotifs, setReactionNotifs] = useState(true);
  const [soundTone, setSoundTone] = useState("default");

  // Load from localStorage
  useEffect(() => {
    setConvTones(localStorage.getItem("wa_notif_conv_tones") !== "false");
    setHighPriority(localStorage.getItem("wa_notif_high_priority") !== "false");
    setReactionNotifs(localStorage.getItem("wa_notif_reactions") !== "false");
    setSoundTone(localStorage.getItem("wa_notif_sound") || "default");
  }, []);

  const saveSetting = (key, value) => {
    localStorage.setItem(key, value);
  };

  const handleToggle = (state, setter, key) => {
    const newVal = !state;
    setter(newVal);
    saveSetting(key, newVal.toString());
  };

  const handleSoundChange = (e) => {
    const val = e.target.value;
    setSoundTone(val);
    saveSetting("wa_notif_sound", val);
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
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>

      <ScrollArea className="flex-1 bg-[#111b21]">
        <div className="py-4 px-6 flex flex-col gap-6">
          {/* Intro Icon */}
          <div className="flex items-center gap-4 py-2 text-[#00a884]">
            <Bell size={32} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Message alerts</span>
              <span className="text-[12px] text-[#8696a0]">Configure sound alerts and previews.</span>
            </div>
          </div>

          <Separator className="bg-[#222e35]" />

          {/* Conversation Tones */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conversation tones</span>
              <button
                onClick={() => handleToggle(convTones, setConvTones, "wa_notif_conv_tones")}
                className={`w-11 h-6 rounded-full transition-colors relative duration-200 focus:outline-none ${
                  convTones ? "bg-[#00a884]" : "bg-[#374248]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                    convTones ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <span className="text-xs text-[#8696a0]">Play sounds for incoming and outgoing messages.</span>
          </div>

          {/* High Priority */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">High priority notifications</span>
              <button
                onClick={() => handleToggle(highPriority, setHighPriority, "wa_notif_high_priority")}
                className={`w-11 h-6 rounded-full transition-colors relative duration-200 focus:outline-none ${
                  highPriority ? "bg-[#00a884]" : "bg-[#374248]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                    highPriority ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <span className="text-xs text-[#8696a0]">Show notification previews at the top of the screen.</span>
          </div>

          {/* Reaction Notifications */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reaction notifications</span>
              <button
                onClick={() => handleToggle(reactionNotifs, setReactionNotifs, "wa_notif_reactions")}
                className={`w-11 h-6 rounded-full transition-colors relative duration-200 focus:outline-none ${
                  reactionNotifs ? "bg-[#00a884]" : "bg-[#374248]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                    reactionNotifs ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <span className="text-xs text-[#8696a0]">Show notifications for reactions to messages you send.</span>
          </div>

          {/* Sound Selector */}
          <div>
            <h3 className="text-[#00a884] text-xs font-semibold uppercase tracking-wider mb-3">
              Notification sound
            </h3>
            <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex flex-col gap-2">
              <span className="text-xs text-[#8696a0]">Choose your default chat notification ringtone:</span>
              <select
                value={soundTone}
                onChange={handleSoundChange}
                className="w-full mt-2 bg-[#202c33] border border-[#313d45] rounded-lg text-white p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00a884]"
              >
                <option value="default">WhatsApp Default Tone</option>
                <option value="chord">Chord (Bright)</option>
                <option value="bell">Bell (Soft)</option>
                <option value="ding">Ding (Quick Alert)</option>
                <option value="none">None (Mute)</option>
              </select>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
