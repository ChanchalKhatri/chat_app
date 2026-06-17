import React from "react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden relative bg-[#111b21]">
      {/* Background Glow Effects */}
      <div className="absolute top-[-150px] left-[-150px] w-[350px] h-[350px] bg-[#222e35] rounded-full blur-[140px] opacity-70 animate-pulse"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[350px] h-[350px] bg-[#222e35] rounded-full blur-[140px] opacity-60 animate-pulse"></div>

      <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#222e35] rounded-full blur-[180px] opacity-20"></div>

      {/* Center Loader */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="w-28 h-28 rounded-full border-[3px] border-[#2f3b43]"></div>

          {/* Animated Ring */}
          <div className="absolute w-28 h-28 rounded-full border-[3px] border-transparent border-t-[#00a884] border-r-[#00d5a3] animate-spin"></div>

          {/* Inner Ring */}
          <div className="absolute w-16 h-16 rounded-full border border-[#3d4d57]"></div>

          {/* Glow Dot */}
          <div className="absolute w-4 h-4 rounded-full bg-[#00d5a3] shadow-[0_0_25px_#00d5a3]"></div>
        </div>

        {/* Text */}
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-black tracking-wide text-white">
            Loading
          </h1>

          <p className="text-sm text-slate-400 mt-2 tracking-[3px] uppercase">
            Please Wait
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2 mt-5">
          <span className="w-2 h-2 rounded-full bg-[#00a884] animate-bounce"></span>

          <span className="w-2 h-2 rounded-full bg-[#00c896] animate-bounce delay-100"></span>

          <span className="w-2 h-2 rounded-full bg-[#00d5a3] animate-bounce delay-200"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
