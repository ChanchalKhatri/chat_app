import { useEffect, useState } from "react";

import {
  createOrGetConversationApi,
  getMyConversationsApi,
} from "../api/conversation.api";

import { getContacts } from "../api/contact.api";

import useAuthStore from "@/store/authStore";

export const useChat = () => {
  const { user } = useAuthStore();

  const [chats, setChats] = useState([]);

  const [selectedChatId, setSelectedChatId] = useState(null);

  const [rightSidebar, setRightSidebar] = useState(null);

  const [currentMessages, setCurrentMessages] = useState([]);

  const selectedItem = chats.find((chat) => chat.id === selectedChatId) || null;

  const setSelectedItem = async (chat) => {
    if (!chat) {
      setSelectedChatId(null);

      setRightSidebar(null);

      return;
    }

    if (!chat.conversationId) {
      try {
        const res = await createOrGetConversationApi(chat.contactUser);

        if (res.success && res.conversation) {
          const conversationId = res.conversation._id;

          setChats((prev) =>
            prev.map((item) =>
              item.id === chat.id
                ? {
                    ...item,
                    conversationId,
                    id: conversationId,
                  }
                : item,
            ),
          );

          setSelectedChatId(conversationId);

          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    setSelectedChatId(chat.id);
  };

  const onClearMessages = () => {
    if (!selectedChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,

            message: "",

            messages: [],
          };
        }

        return chat;
      }),
    );
  };

  const onCloseChat = () => {
    setSelectedItem(null);
  };

  const formatConversation = (conversation, contactsList) => {
    const otherUser =
      conversation.participants.find(
        (participant) =>
          participant._id !== user?._id && participant._id !== user?.id,
      ) || {};

    const matchedContact = contactsList.find(
      (c) => (c.contactUser?._id || c.contactUser) === otherUser._id,
    );

    let firstName = "User";
    let lastName = "";
    let fullName = "User";
    let phone = otherUser.phone || "";
    let about = otherUser.description || "Hey there 👋";

    if (matchedContact) {
      firstName = matchedContact.firstName || "";
      lastName = matchedContact.lastName || "";
      fullName = `${firstName} ${lastName}`.trim() || "User";
      phone = matchedContact.phone || otherUser.phone || "";
      about =
        matchedContact.about || otherUser.description || "Hey there 👋";
    } else {
      fullName = otherUser.name || "User";
      const nameParts = fullName.split(" ");
      firstName = nameParts[0] || "User";
      lastName = nameParts.slice(1).join(" ") || "";
    }

    return {
      id: conversation._id,

      conversationId: conversation._id,

      contactUser: otherUser._id,

      firstName: firstName,

      lastName: lastName,

      name: fullName,

      email: otherUser.email || "",

      phone: phone,

      about: about,

      profilePic:
        otherUser.profilePic ||
        `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=ede9fe&color=7c3aed`,

      image:
        otherUser.profilePic ||
        `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=ede9fe&color=7c3aed`,

      message: conversation.lastMessage || "Start conversation",

      time: conversation.lastMessageTime
        ? new Date(conversation.lastMessageTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",

      messages: [],
    };
  };

  const formatContactWithoutConversation = (c) => {
    const contactUserId = c.contactUser?._id || c.contactUser;
    const firstName = c.firstName || "";
    const lastName = c.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || "User";

    return {
      id: c._id,
      conversationId: null,
      contactUser: contactUserId,
      firstName: firstName,
      lastName: lastName,
      name: fullName,
      email: c.contactUser?.email || "",
      phone: c.phone || c.contactUser?.phone || "",
      about: c.about || c.contactUser?.description || "Hey there 👋",
      profilePic:
        c.profilePic ||
        c.contactUser?.profilePic ||
        `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=ede9fe&color=7c3aed`,
      image:
        c.profilePic ||
        c.contactUser?.profilePic ||
        `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=ede9fe&color=7c3aed`,
      message: c.about || "Hey there 👋",
      time: "",
      messages: [],
    };
  };

  useEffect(() => {
    const fetchConversationsAndContacts = async () => {
      try {
        let contactsList = [];
        try {
          const contactsRes = await getContacts();
          if (contactsRes.success && contactsRes.contacts) {
            contactsList = contactsRes.contacts;
          }
        } catch (err) {
          console.log("Fetch Contacts Error:", err);
        }

        const res = await getMyConversationsApi();

        if (res.success && res.conversations) {
          const formattedChats = res.conversations.map((conversation) =>
            formatConversation(conversation, contactsList),
          );

          const conversationContactIds = formattedChats.map((c) => c.contactUser);
          const contactsWithoutConversations = contactsList
            .filter((c) => {
              const contactUserId = c.contactUser?._id || c.contactUser;
              return (
                contactUserId && !conversationContactIds.includes(contactUserId)
              );
            })
            .map(formatContactWithoutConversation);

          setChats([...formattedChats, ...contactsWithoutConversations]);
        }
      } catch (error) {
        console.log("Fetch Conversations Error:", error);
      }
    };

    if (user?._id) {
      fetchConversationsAndContacts();
    }
  }, [user]);

  return {
    chats,
    setChats,
    selectedChatId,
    setSelectedChatId,
    rightSidebar,
    setRightSidebar,
    currentMessages,
    setCurrentMessages,
    selectedItem,
    setSelectedItem,
    onClearMessages,
    onCloseChat,
  };
};
