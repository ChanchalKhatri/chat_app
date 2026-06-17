import React, { useState, useRef } from "react";

import {
  Camera,
  ChevronRight,
  Shield,
  Bell,
  Lock,
  ArrowLeft,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";

import EditableProfileField from "./EditableProfileField";
import useAuthStore from "@/store/authStore";
import PrivacySettings from "./PrivacySettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";

const ProfilePage = ({ onClose }) => {
  const { user, updateUser, logout } = useAuthStore();

  const [name, setName] = useState(user?.name || "User");

  const [bio, setBio] = useState(user?.description || "Hey there 👋");

  const [phone, setPhone] = useState(user?.phone || "+91 9876543210");

  const [profileImage, setProfileImage] = useState(
    user?.profilePic || "https://ui-avatars.com/api/?name=User&background=ede9fe&color=7c3aed"
  );

  const [currentScreen, setCurrentScreen] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64Image = e.target.result;
        setProfileImage(base64Image);
        updateUser({ profilePic: base64Image });
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSaveName = (newName) => {
    setName(newName);
    updateUser({ name: newName });
  };

  const handleSaveBio = (newBio) => {
    setBio(newBio);
    updateUser({ description: newBio });
  };

  const handleSavePhone = (newPhone) => {
    setPhone(newPhone);
    updateUser({ phone: newPhone });
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

  return (
    <div className="w-full h-full bg-[#111b21] text-white overflow-hidden animate-in slide-in-from-left duration-300">
      <ScrollArea className="h-full">
        {/* Header */}
        <div className="w-full h-[60px] bg-[#202c33] border-b border-[#313d45] flex items-center px-4 gap-4 sticky top-0 z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
          >
            <ArrowLeft size={24} />
          </Button>

          <h1 className="text-xl font-semibold">Profile</h1>
        </div>

        {/* Profile Section */}
        <Card className="flex flex-col items-center py-8 border-0 border-b border-[#222e35] rounded-none bg-transparent shadow-none">
          {/* Profile Image */}
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="w-40 h-40">
              <AvatarImage
                src={profileImage}
                alt="profile"
                className="object-cover"
              />

              <AvatarFallback className="bg-[#2a3942] text-4xl text-white">
                {name?.[0]}
              </AvatarFallback>
            </Avatar>

            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Camera size={30} className="mb-2" />

              <span className="text-xs uppercase text-center w-24">
                Change Profile Photo
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Name */}
          <h2 className="text-2xl font-semibold mt-5">{name}</h2>

          {/* Bio */}
          <p className="text-[#8696a0] mt-2 text-sm">{bio}</p>
        </Card>

        {/* Info Sections */}
        <div className="py-3">
          {/* Name */}
          <EditableProfileField
            label="Your Name"
            value={name}
            onSave={handleSaveName}
            description="This is not your username or pin. This name will be visible to your WhatsApp contacts."
          />

          {/* Bio */}
          <EditableProfileField label="Bio" value={bio} onSave={handleSaveBio} />

          {/* Phone */}
          <EditableProfileField
            label="Phone"
            value={phone}
            onSave={handleSavePhone}
          />
        </div>

        <Separator className="bg-[#1f2c34]" />

        {/* Settings */}
        <div className="mt-4">
          {/* Privacy */}
          <div
            onClick={() => setCurrentScreen("privacy")}
            className="px-6 py-4 hover:bg-[#202c33] transition cursor-pointer border-b border-[#1f2c34] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Shield className="text-[#8696a0]" />

              <span>Privacy</span>
            </div>

            <ChevronRight className="text-[#8696a0]" />
          </div>

          {/* Notifications */}
          <div
            onClick={() => setCurrentScreen("notifications")}
            className="px-6 py-4 hover:bg-[#202c33] transition cursor-pointer border-b border-[#1f2c34] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Bell className="text-[#8696a0]" />

              <span>Notifications</span>
            </div>

            <ChevronRight className="text-[#8696a0]" />
          </div>

          {/* Security */}
          <div
            onClick={() => setCurrentScreen("security")}
            className="px-6 py-4 hover:bg-[#202c33] transition cursor-pointer border-b border-[#1f2c34] flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Lock className="text-[#8696a0]" />

              <span>Security</span>
            </div>

            <ChevronRight className="text-[#8696a0]" />
          </div>

          {/* Logout */}
          <div
            onClick={logout}
            className="px-6 py-4 hover:bg-[#b91c1c]/10 text-red-500 transition cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <LogOut className="text-red-500" />

              <span className="font-semibold">Log out</span>
            </div>

            <ChevronRight className="text-red-500" />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProfilePage;
