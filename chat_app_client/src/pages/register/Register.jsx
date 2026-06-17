import { useState } from "react";
import {
  Camera,
  Phone,
  User,
  FileText,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

import axios from "axios";
import { registerUser } from "@/api/authApi";

export default function Register() {
  const [profile, setProfile] = useState(null);

  const [preview, setPreview] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    phone: "",
    password: "",
    description: "",
  });

  // Handle Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

    try {
      setLoading(true);

      const res = await registerUser({
        name: data.name,
        phone: data.phone,
        password: data.password,
        description: data.description,
        profilePic: preview,
      });

      alert(res.message);

      // Reset Form
      setData({
        name: "",
        phone: "",
        password: "",
        description: "",
      });

      setPreview("");

      setProfile(null);
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-violet-200 via-white to-fuchsia-200 flex items-center justify-center px-4 relative">
      {/* Background Blur */}
      <div className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] bg-violet-400 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] bg-fuchsia-400 rounded-full blur-3xl opacity-30"></div>

      {/* Card */}
      <Card className="w-full max-w-md rounded-[35px] border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(124,58,237,0.25)] overflow-hidden">
        {/* Top Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500"></div>

        <CardContent className="p-2 px-6">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={22} />
            </div>
          </div>

          {/* Profile */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              {/* Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 animate-pulse blur-md opacity-60"></div>

              {/* Avatar */}
              <Avatar className="relative w-24 h-24 border-[5px] border-white shadow-2xl">
                <AvatarImage
                  src={
                    preview ||
                    "https://ui-avatars.com/api/?name=User&background=ede9fe&color=7c3aed&size=200"
                  }
                  alt="profile"
                />

                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              {/* Upload */}
              <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-white cursor-pointer shadow-xl hover:scale-110 transition-all duration-300">
                <Camera size={18} />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
              Welcome
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Create your beautiful profile ✨
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <Label className="text-slate-700 font-medium">Full Name</Label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <Input
                  name="name"
                  type="text"
                  value={data.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                  className="h-11 pl-10 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md focus:border-violet-500 focus:ring-2 focus:ring-violet-300 transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label className="text-slate-700 font-medium">Phone Number</Label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-fuchsia-500"
                />

                <Input
                  name="phone"
                  type="tel"
                  value={data.phone}
                  placeholder="Enter phone number"
                  onChange={handleChange}
                  className="h-11 pl-10 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-300 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="text-slate-700 font-medium">Password</Label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  placeholder="Create a password"
                  onChange={handleChange}
                  className="h-11 pl-10 pr-10 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md focus:border-violet-500 focus:ring-2 focus:ring-violet-300 transition-all"
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 hover:bg-transparent transition h-8 w-8"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label className="text-slate-700 font-medium">Description</Label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-3 top-3 text-pink-500"
                />

                <Textarea
                  name="description"
                  value={data.description}
                  placeholder="Tell us about yourself..."
                  onChange={handleChange}
                  className="min-h-[70px] pl-10 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-md resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-300 transition-all"
                />
              </div>
            </div>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl text-base font-bold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-[1px] bg-slate-200"></div>

            <p className="text-xs text-slate-400">OR</p>

            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>

          {/* Login */}
          <div className="text-center">
            <p className="text-sm text-slate-500">Already have an account?</p>

            <Link
              to="/login"
              className="mt-1 text-sm font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
            >
              Login Here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
