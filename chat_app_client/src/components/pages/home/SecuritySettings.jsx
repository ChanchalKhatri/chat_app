import React, { useState, useEffect } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function SecuritySettings({ onBack }) {
  const [showSecNotifs, setShowSecNotifs] = useState(false);
  const [twoStepEnable, setTwoStepEnable] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setShowSecNotifs(localStorage.getItem("wa_sec_show_notifs") === "true");
    setTwoStepEnable(localStorage.getItem("wa_sec_two_step") === "true");
  }, []);

  const saveSetting = (key, value) => {
    localStorage.setItem(key, value);
  };

  const handleToggle = (state, setter, key) => {
    const newVal = !state;
    setter(newVal);
    saveSetting(key, newVal.toString());
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
        <h1 className="text-xl font-semibold">Security</h1>
      </div>

      <ScrollArea className="flex-1 bg-[#111b21]">
        <div className="py-4 px-6 flex flex-col gap-6">
          {/* Intro Icon */}
          <div className="flex items-center gap-4 py-2 text-[#00a884]">
            <Lock size={32} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">End-to-End Encryption</span>
              <span className="text-[12px] text-[#8696a0]">Your messages and calls are secure.</span>
            </div>
          </div>

          <Separator className="bg-[#222e35]" />

          {/* Encryption Text */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] text-xs text-[#8696a0] leading-normal flex flex-col gap-2">
            <span className="font-semibold text-white text-sm">Security at all times</span>
            <p>
              WhatsApp secures your conversations with end-to-end encryption. This means your messages, media, and calls are secured so only you and the person you are communicating with can read or listen to them. Not even WhatsApp can intercept them.
            </p>
          </div>

          {/* Security Notifications Toggle */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Show security notifications</span>
              <button
                onClick={() => handleToggle(showSecNotifs, setShowSecNotifs, "wa_sec_show_notifs")}
                className={`w-11 h-6 rounded-full transition-colors relative duration-200 focus:outline-none ${
                  showSecNotifs ? "bg-[#00a884]" : "bg-[#374248]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                    showSecNotifs ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <span className="text-xs text-[#8696a0]">
              Get notified when a contact's security code changes for end-to-end encryption.
            </span>
          </div>

          {/* Two-step Verification */}
          <div className="bg-[#0b141a] p-4 rounded-xl border border-[#222e35] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Two-step verification</span>
              <button
                onClick={() => handleToggle(twoStepEnable, setTwoStepEnable, "wa_sec_two_step")}
                className={`w-11 h-6 rounded-full transition-colors relative duration-200 focus:outline-none ${
                  twoStepEnable ? "bg-[#00a884]" : "bg-[#374248]"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-200 ${
                    twoStepEnable ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <span className="text-xs text-[#8696a0]">
              Require a security PIN when registering your phone number with WhatsApp again.
            </span>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
