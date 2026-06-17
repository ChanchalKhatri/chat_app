import { useState } from "react";
import { Phone, Lock, Sparkles, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "@/api/authApi";
import useAuthStore from "@/store/authStore";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    phone: "",
    password: "",
  });

  // Handle Change
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

      const res = await loginUser({
        phone: data.phone,
        password: data.password,
      });

      alert(res.message);

      if (res.success) {
        login(res.token, res.user);

        navigate("/");
      }

      setData({
        phone: "",
        password: "",
      });
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-violet-200 via-white to-fuchsia-200 flex items-center justify-center px-3 sm:px-4 relative">
      <div className="absolute top-[-120px] left-[-120px] w-[220px] sm:w-[280px] h-[220px] sm:h-[280px] bg-violet-400 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[220px] sm:w-[280px] h-[220px] sm:h-[280px] bg-pink-400 rounded-full blur-3xl opacity-30"></div>

      <Card className="w-full max-w-[95%] sm:max-w-md rounded-[28px] sm:rounded-[35px] border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(124,58,237,0.25)] overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500"></div>

        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl">
              <Sparkles className="text-white" size={22} />
            </div>
          </div>

          <div className="flex justify-center mb-3 sm:mb-4">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-[4px] sm:border-[5px] border-white shadow-2xl">
              <AvatarImage
                src="https://ui-avatars.com/api/?name=User"
                alt="profile"
              />

              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>

          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Login to continue 🚀
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1">
              <Label>Phone Number</Label>

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
                  className="h-11 pl-10 rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Password</Label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500"
                />

                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  placeholder="Enter password"
                  onChange={handleChange}
                  className="h-11 pl-10 pr-10 rounded-2xl"
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-2xl"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center mt-5">
            <p className="text-sm text-slate-500">Don’t have an account?</p>

            <Link to="/register" className="font-bold text-violet-600">
              Register Here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
