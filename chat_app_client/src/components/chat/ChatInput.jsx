// chat/ChatInput.jsx

import React, { useRef, useState, useEffect } from "react";

import { Smile, Mic, Send, Square, MicOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import AttachmentMenu from "./AttachmentMenu";

const ChatInput = ({
  messageText,
  setMessageText,
  onSend,
  onFileUpload,
  onToggleEmoji,
}) => {
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const timerRef = useRef(null);

  // Initialize MediaRecorder
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: "audio/webm" });
        
        // Only send if recording has some content
        if (chunks.length > 0 && recordingTime > 0) {
          onFileUpload(audioFile, "audio");
        }
        
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100); // Collect data every 100ms
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    startRecording();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    stopRecording();
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Detect file type based on MIME type
    if (file.type.startsWith('audio/')) {
      onFileUpload(file, 'audio');
    } else if (file.type.startsWith('image/')) {
      onFileUpload(file, 'image');
    } else if (file.type.startsWith('video/')) {
      onFileUpload(file, 'video');
    } else {
      onFileUpload(file, type);
    }

    // reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="w-full min-h-[62px] bg-[#202c33] border-t border-[#313d45] px-4 py-3 flex items-center gap-3 shrink-0">
      {/* LEFT ACTIONS */}
      <div className="flex items-center gap-1">
        {/* EMOJI */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-[#2a3942]"
          onClick={onToggleEmoji}
        >
          <Smile className="text-[#8696a0]" size={22} />
        </Button>

        {/* ATTACHMENT MENU */}
        <AttachmentMenu
          imageInputRef={imageInputRef}
          docInputRef={docInputRef}
        />

        {/* MEDIA INPUT */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "media")}
        />

        {/* DOCUMENT INPUT */}
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,audio/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, "document")}
        />
      </div>

      {/* MESSAGE INPUT */}
      <div className="flex-1">
        {isRecording ? (
          <div className="w-full h-11 bg-[#2a3942] rounded-lg flex items-center justify-between px-4 gap-3 border border-[#00a884]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mic className="text-[#00a884]" size={18} />
              <span className="text-[#8696a0] text-xs">Release to send</span>
            </div>
          </div>
        ) : (
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message"
            className="bg-[#2a3942] border-0 text-white placeholder:text-[#8696a0] focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                if (messageText.trim()) {
                  onSend();
                }
              }
            }}
          />
        )}
      </div>

      {/* RIGHT ACTION */}
      {messageText.trim() ? (
        <Button
          type="button"
          onClick={onSend}
          variant="ghost"
          size="icon"
          className="hover:bg-[#2a3942]"
        >
          <Send className="text-[#00a884]" size={22} />
        </Button>
      ) : (
        <Button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          variant="ghost"
          size="icon"
          className={`hover:bg-[#2a3942] ${isRecording ? "bg-red-500/20" : ""}`}
        >
          {isRecording ? (
            <Square className="text-red-500" size={22} />
          ) : (
            <Mic className="text-[#8696a0]" size={22} />
          )}
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
