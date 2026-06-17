import React, { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { User, Phone, X } from "lucide-react";

import { add } from "@/api/contact.api";

const NewContactModal = ({ open, setOpen, chats, setChats }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setData({
      ...data,

      [e.target.name]: e.target.value,
    });
  };

  // Handle Submit
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!data.firstName.trim()) {
    return alert("First name is required");
  }

  if (!data.phone.trim()) {
    return alert("Phone number is required");
  }

  try {
    setLoading(true);

    const res = await add({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });

    const newChat = {
      id: res.contact._id,
      name: `${res.contact.firstName} ${res.contact.lastName}`,
      firstName: res.contact.firstName,
      lastName: res.contact.lastName,
      message: res.contact.about || "Hey there 👋",
      time: "Just now",
      image:
        res.contact.profilePic ||
        `https://ui-avatars.com/api/?name=${res.contact.firstName}+${res.contact.lastName}&background=ede9fe&color=7c3aed`,
      profilePic:
        res.contact.profilePic ||
        `https://ui-avatars.com/api/?name=${res.contact.firstName}+${res.contact.lastName}&background=ede9fe&color=7c3aed`,
      contactUser: res.contact.contactUser,
      conversationId: null,
      messages: [],
    };

    // Add instantly to UI
    setChats((prev) => [newChat, ...prev]);

    alert(res.message);

    // Reset
    setData({
      firstName: "",
      lastName: "",
      phone: "",
    });

    setOpen(false);
  } catch (error) {
    console.log(error);

    alert(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#111b21] border border-[#2a3942] p-0 overflow-hidden rounded-3xl sm:max-w-md shadow-[0_10px_60px_rgba(0,0,0,0.6)] [&>button]:hidden">
        {/* Header */}
        <div className="relative h-36 bg-gradient-to-br from-[#00a884] via-[#009d7d] to-[#008069] overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md flex items-center justify-center transition-all duration-300"
          >
            <X size={18} className="text-white" />
          </button>

          {/* Icon */}
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl">
              <User size={34} className="text-white" />
            </div>

            <h1 className="text-white text-2xl font-bold mt-3 tracking-wide">
              New Contact
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name */}
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8696a0]"
              />

              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={data.firstName}
                onChange={handleChange}
                className="bg-[#202c33] border-[#2a3942] h-14 rounded-2xl pl-12 text-white placeholder:text-[#8696a0] focus-visible:ring-1 focus-visible:ring-[#00a884]"
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8696a0]"
              />

              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={data.lastName}
                onChange={handleChange}
                className="bg-[#202c33] border-[#2a3942] h-14 rounded-2xl pl-12 text-white placeholder:text-[#8696a0] focus-visible:ring-1 focus-visible:ring-[#00a884]"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8696a0]"
              />

              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={data.phone}
                onChange={handleChange}
                className="bg-[#202c33] border-[#2a3942] h-14 rounded-2xl pl-12 text-white placeholder:text-[#8696a0] focus-visible:ring-1 focus-visible:ring-[#00a884]"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#00a884] hover:bg-[#02bd95] text-white font-semibold text-base shadow-[0_10px_30px_rgba(0,168,132,0.35)] transition-all duration-300 hover:scale-[1.01]"
            >
              {loading ? "Creating..." : "Create Contact"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewContactModal;