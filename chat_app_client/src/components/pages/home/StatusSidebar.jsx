import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MoreVertical,
  Camera,
  Pencil,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/store/authStore";
import { sendMessageApi } from "@/api/message.api";
import { createOrGetConversationApi } from "@/api/conversation.api";
import {
  createStatusApi,
  getMyStatusesApi,
  getContactStatusesApi,
  viewStatusApi,
  deleteStatusApi,
} from "@/api/status.api";

export default function StatusSidebar({ onClose, chats, setChats }) {
  const { user } = useAuthStore();
  const fileInputRef = useRef(null);

  // States
  const [myStatuses, setMyStatuses] = useState([]);
  const [contactStatuses, setContactStatuses] = useState([]);
  const [activeViewer, setActiveViewer] = useState(null); // { name, avatar, statuses: [], index: 0, chatObj }
  const [replyText, setReplyText] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const menuRef = useRef(null);

  // Fetch statuses from database
  useEffect(() => {
    fetchStatuses();
  }, [chats]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowAddMenu(false);
      }
    };

    if (showAddMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddMenu]);

  const fetchStatuses = async () => {
    try {
      setLoading(true);

      // Fetch my statuses
      const myRes = await getMyStatusesApi();
      if (myRes.success && myRes.statuses) {
        const formattedMyStatuses = myRes.statuses.map((status) => ({
          id: status._id,
          url: status.content,
          time: getTimeAgo(status.createdAt),
          caption: status.caption,
        }));
        setMyStatuses(formattedMyStatuses);
      }

      // Fetch contact statuses
      const contactRes = await getContactStatusesApi();
      if (contactRes.success && contactRes.statuses) {
        const formattedContactStatuses = contactRes.statuses.map(
          (statusGroup) => {
            // Find matching chat for this user
            const matchingChat = chats.find(
              (chat) => chat.contactUser === statusGroup.id,
            );

            return {
              id: statusGroup.id,
              name: statusGroup.name,
              avatar: statusGroup.avatar,
              chatObj: matchingChat || null,
              statuses: statusGroup.statuses.map((s) => ({
                id: s._id,
                url: s.content,
                time: s.time,
                caption: s.caption,
              })),
              viewed: statusGroup.viewed,
            };
          },
        );
        setContactStatuses(formattedContactStatuses);
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get time ago string
  function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  }

  // Handle uploading status
  const handleUploadClick = () => {
    setShowAddMenu(true);
  };

  const handleSelectPhotos = () => {
    setShowAddMenu(false);
    fileInputRef.current?.click();
  };

  const handleSelectText = () => {
    setShowAddMenu(false);
    // TODO: Implement text status
    console.log("Text status selected");
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "image");

        const res = await createStatusApi(formData);

        if (res.success && res.status) {
          const newStatus = {
            id: res.status._id,
            url: res.status.content,
            time: "Just now",
            caption: res.status.caption,
          };
          setMyStatuses([newStatus, ...myStatuses]);
        }
      } catch (error) {
        console.error("Error uploading status:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle delete status
  const handleDeleteStatus = async (statusId) => {
    try {
      const res = await deleteStatusApi(statusId);
      if (res.success) {
        setMyStatuses(myStatuses.filter((s) => s.id !== statusId));
      }
    } catch (error) {
      console.error("Error deleting status:", error);
    }
  };

  // Status Player loop
  useEffect(() => {
    if (!activeViewer) return;

    setProgress(0);
    const duration = 5000; // 5 seconds per status
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          handleNextStatus();
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeViewer?.index, activeViewer?.id]);

  const handleNextStatus = async () => {
    if (!activeViewer) return;
    const nextIdx = activeViewer.index + 1;

    // Mark current status as viewed if it's a contact's status
    if (activeViewer.id !== "me" && activeViewer.statuses[activeViewer.index]) {
      try {
        await viewStatusApi(activeViewer.statuses[activeViewer.index].id);
      } catch (error) {
        console.error("Error marking status as viewed:", error);
      }
    }

    if (nextIdx < activeViewer.statuses.length) {
      setActiveViewer({
        ...activeViewer,
        index: nextIdx,
      });
    } else {
      // Close viewer
      // Mark as viewed
      if (activeViewer.id !== "me") {
        setContactStatuses((prev) =>
          prev.map((c) =>
            c.id === activeViewer.id ? { ...c, viewed: true } : c,
          ),
        );
      }
      setActiveViewer(null);
    }
  };

  const handlePrevStatus = () => {
    if (!activeViewer) return;
    const prevIdx = activeViewer.index - 1;
    if (prevIdx >= 0) {
      setActiveViewer({
        ...activeViewer,
        index: prevIdx,
      });
    }
  };

  // Reply to status
  const handleSendReply = async () => {
    if (!replyText.trim() || !activeViewer) return;

    const chatObj = activeViewer.chatObj;
    if (!chatObj) {
      setActiveViewer(null);
      setReplyText("");
      return;
    }

    try {
      let convId = chatObj.conversationId || chatObj.id;
      if (!convId) {
        // Create conversation
        const res = await createOrGetConversationApi(chatObj.contactUser);
        if (res.success && res.conversation) {
          convId = res.conversation._id;
        }
      }

      if (convId) {
        await sendMessageApi({
          conversationId: convId,
          receiverId: chatObj.contactUser,
          text: `*[Replied to Status]*: ${replyText}`,
          type: "text",
        });

        // Trigger local updates in chat
        setChats((prev) =>
          prev.map((c) =>
            c.contactUser === chatObj.contactUser
              ? {
                  ...c,
                  message: `*[Replied to Status]*: ${replyText}`,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                }
              : c,
          ),
        );
      }
    } catch (err) {
      console.error("Error sending status reply:", err);
    }

    setReplyText("");
    setActiveViewer(null);
  };

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col overflow-hidden animate-in slide-in-from-left duration-300 relative">
      {/* Header */}
      <div className="w-full h-[60px] bg-[#202c33] border-b border-[#313d45] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-semibold">Status</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUploadClick}
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
          >
            <Plus size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#aebac1] hover:text-white transition rounded-full hover:bg-[#374248]"
          >
            <MoreVertical size={24} />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-[#111b21]">
        <div className="p-4 flex flex-col gap-4">
          {/* My Status */}
          <div className="flex items-center justify-between py-2 border-b border-[#222e35]">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => {
                if (myStatuses.length > 0) {
                  setActiveViewer({
                    id: "me",
                    name: "My Status",
                    avatar:
                      user?.profilePic ||
                      "https://ui-avatars.com/api/?name=Me&background=ede9fe&color=7c3aed",
                    statuses: myStatuses,
                    index: 0,
                    chatObj: null,
                  });
                } else {
                  handleUploadClick();
                }
              }}
            >
              <div className="relative">
                <Avatar
                  className={`w-12 h-12 border-2 ${
                    myStatuses.length > 0
                      ? "border-[#00a884]"
                      : "border-transparent"
                  }`}
                >
                  <AvatarImage
                    src={
                      user?.profilePic ||
                      "https://ui-avatars.com/api/?name=Me&background=ede9fe&color=7c3aed"
                    }
                  />
                  <AvatarFallback className="bg-[#2a3942] text-white">
                    M
                  </AvatarFallback>
                </Avatar>
                {myStatuses.length === 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-[#00a884] text-white rounded-full p-1 border-2 border-[#111b21]">
                    <Plus size={14} className="stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-[15px]">My status</span>
                <span className="text-[13px] text-[#8696a0]">
                  {myStatuses.length > 0
                    ? `${myStatuses.length} status updates`
                    : "Click to add status update"}
                </span>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Add Status Popup Menu */}
          {showAddMenu && (
            <div
              ref={menuRef}
              className="absolute top-[60px] right-4 z-50 bg-white rounded-lg shadow-xl w-48 overflow-hidden"
            >
              <div
                onClick={handleSelectPhotos}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer border-2 border-[#00a884] bg-gray-50"
              >
                <Camera size={16} className="text-gray-700" />
                <span className="text-gray-800 font-medium text-sm">
                  Photos & videos
                </span>
              </div>
              <div
                onClick={handleSelectText}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
              >
                <Pencil size={16} className="text-gray-700" />
                <span className="text-gray-800 font-medium text-sm">Text</span>
              </div>
            </div>
          )}

          {/* Status Updates */}
          <div>
            <h2 className="text-[14px] text-[#00a884] font-semibold uppercase tracking-wider mb-3 px-2">
              Recent updates
            </h2>
            <div className="flex flex-col">
              {contactStatuses.map((status) => (
                <div
                  key={status.id}
                  onClick={() => {
                    setActiveViewer({
                      id: status.id,
                      name: status.name,
                      avatar: status.avatar,
                      statuses: status.statuses,
                      index: 0,
                      chatObj: status.chatObj,
                    });
                  }}
                  className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-[#202c33] cursor-pointer transition"
                >
                  <Avatar
                    className={`w-12 h-12 border-2 ${
                      status.viewed ? "border-[#8696a0]" : "border-[#00a884]"
                    }`}
                  >
                    <AvatarImage src={status.avatar} />
                    <AvatarFallback className="bg-[#2a3942] text-white">
                      {status.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <span className="font-medium text-[15px]">
                      {status.name}
                    </span>
                    <span className="text-[13px] text-[#8696a0]">
                      {status.statuses[0]?.time || "Some time ago"}
                    </span>
                  </div>
                </div>
              ))}
              {contactStatuses.length === 0 && (
                <div className="text-center py-6 text-sm text-[#8696a0]">
                  No status updates available
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* FULLSCREEN STATUS PLAYER */}
      {activeViewer && (
        <div className="fixed inset-0 z-50 bg-[#080f14] flex flex-col justify-between items-center animate-in fade-in duration-200">
          {/* Top Progress Bar & Header */}
          <div className="w-full max-w-[500px] px-4 pt-4 flex flex-col gap-3 z-10">
            {/* Progress Bars */}
            <div className="w-full flex gap-1">
              {activeViewer.statuses.map((s, idx) => (
                <div
                  key={s.id}
                  className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all ease-linear"
                    style={{
                      width:
                        idx < activeViewer.index
                          ? "100%"
                          : idx === activeViewer.index
                            ? `${progress}%`
                            : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header Content */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-[#313d45]">
                  <AvatarImage src={activeViewer.avatar} />
                  <AvatarFallback className="bg-[#2a3942] text-white">
                    {activeViewer.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {activeViewer.name}
                  </span>
                  <span className="text-[11px] text-white/70">
                    {activeViewer.statuses[activeViewer.index]?.time}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white rounded-full hover:bg-white/10"
                onClick={() => setActiveViewer(null)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>

          {/* Media Content Display */}
          <div className="relative w-full max-w-[500px] flex-1 flex items-center justify-center">
            {/* Prev Trigger Area */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[25%] cursor-pointer flex items-center justify-start p-2 group"
              onClick={handlePrevStatus}
            >
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 text-white bg-black/40 rounded-full w-8 h-8"
              >
                <ChevronLeft size={20} />
              </Button>
            </div>

            {/* Main Image */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={activeViewer.statuses[activeViewer.index]?.url}
                alt="Status update"
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />
              {activeViewer.statuses[activeViewer.index]?.caption && (
                <p className="text-white text-sm text-center px-4 max-w-[500px]">
                  {activeViewer.statuses[activeViewer.index].caption}
                </p>
              )}
            </div>

            {/* Next Trigger Area */}
            <div
              className="absolute right-0 top-0 bottom-0 w-[25%] cursor-pointer flex items-center justify-end p-2 group"
              onClick={handleNextStatus}
            >
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 text-white bg-black/40 rounded-full w-8 h-8"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>

          {/* Bottom Reply Area (For contact status only) */}
          {activeViewer.id !== "me" && activeViewer.chatObj ? (
            <div className="w-full max-w-[500px] px-4 pb-6 pt-2 z-10 flex gap-2">
              <Input
                type="text"
                placeholder="Reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendReply();
                }}
                className="bg-[#202c33] border-none text-white placeholder:text-[#8696a0] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 py-5 h-11"
              />
              <Button
                onClick={handleSendReply}
                className="bg-[#00a884] hover:bg-[#02bd95] rounded-xl w-11 h-11 flex items-center justify-center p-0 shrink-0"
              >
                <Send size={18} className="text-white" />
              </Button>
            </div>
          ) : activeViewer.id === "me" ? (
            <div className="w-full max-w-[500px] px-4 pb-6 pt-2 z-10 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-white rounded-full hover:bg-white/10"
                onClick={() => {
                  const currentStatus =
                    activeViewer.statuses[activeViewer.index];
                  if (currentStatus) {
                    handleDeleteStatus(currentStatus.id);
                    setActiveViewer(null);
                  }
                }}
              >
                <Trash2 size={20} />
              </Button>
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
    </div>
  );
}
