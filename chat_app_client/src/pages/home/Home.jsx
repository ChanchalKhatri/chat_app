import React, { useState } from "react";

import OptionBar from "../../components/layout/OptionBar";

import Sidebar from "../../components/layout/Sidebar";

import MainArea from "../../components/layout/MainArea";

import ProfilePage from "../../components/pages/home/ProfilePage";

import ContactInfo from "../../components/pages/home/ContactInfo";

import SearchMessages from "../../components/pages/home/SearchMessages";

import StatusSidebar from "../../components/pages/home/StatusSidebar";
import GallerySidebar from "../../components/pages/home/GallerySidebar";
import SettingsSidebar from "../../components/pages/home/SettingsSidebar";

import { useChat } from "../../hooks/useChat";

const Home = () => {
  const [activeMenu, setActiveMenu] = useState("chat");

  const {
    chats,
    setChats,
    selectedItem,
    setSelectedItem,
    rightSidebar,
    setRightSidebar,
    currentMessages,
    setCurrentMessages,
    onClearMessages,
    onCloseChat,
  } = useChat();

  return (
    <main className="w-full h-screen flex overflow-hidden bg-[#0b141a]">
      {/* OPTION BAR */}
      <OptionBar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        setSelectedItem={setSelectedItem}
        chats={chats}
      />

      {/* SIDEBAR */}
      {activeMenu === "profile" ? (
        <div className="w-full max-w-[380px] h-screen border-r border-[#313d45]">
          <ProfilePage onClose={() => setActiveMenu("chat")} />
        </div>
      ) : activeMenu === "status" ? (
        <div className="w-full max-w-[380px] h-screen border-r border-[#313d45]">
          <StatusSidebar
            onClose={() => setActiveMenu("chat")}
            chats={chats}
            setChats={setChats}
          />
        </div>
      ) : activeMenu === "gallery" ? (
        <div className="w-full max-w-[380px] h-screen border-r border-[#313d45]">
          <GallerySidebar
            onClose={() => setActiveMenu("chat")}
            selectedItem={selectedItem}
            messages={selectedItem?.messages || currentMessages || []}
          />
        </div>
      ) : activeMenu === "settings" ? (
        <div className="w-full max-w-[380px] h-screen border-r border-[#313d45]">
          <SettingsSidebar
            onClose={() => setActiveMenu("chat")}
            onGoToProfile={() => setActiveMenu("profile")}
          />
        </div>
      ) : (
        <Sidebar
          activeMenu={activeMenu}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          chats={chats}
          setChats={setChats}
          setActiveMenu={setActiveMenu}
        />
      )}

      {/* MAIN AREA */}
      <div className="flex-1 h-screen flex overflow-hidden">
        <MainArea
          activeMenu={activeMenu}
          selectedItem={selectedItem}
          setChats={setChats}
          onToggleContactInfo={() =>
            setRightSidebar(rightSidebar === "info" ? null : "info")
          }
          onToggleSearchMessages={() =>
            setRightSidebar(rightSidebar === "search" ? null : "search")
          }
          onClearMessages={onClearMessages}
          onCloseChat={onCloseChat}
          rightSidebar={rightSidebar}
          onMessagesChange={setCurrentMessages}
        />

        {/* CONTACT INFO */}
        {rightSidebar === "info" && selectedItem && (
          <div className="w-[340px] h-screen overflow-y-auto shrink-0 border-l border-[#313d45]">
            <ContactInfo
              contact={selectedItem}
              onClose={() => setRightSidebar(null)}
            />
          </div>
        )}

        {/* SEARCH */}
        {rightSidebar === "search" && selectedItem && (
          <div className="w-[340px] h-screen shrink-0 border-l border-[#313d45]">
            <SearchMessages
              contact={selectedItem}
              messages={currentMessages}
              onClose={() => setRightSidebar(null)}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
