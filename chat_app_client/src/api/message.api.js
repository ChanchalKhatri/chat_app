// api/message.api.js

import API from "@/lib/axios";

export const sendMessageApi = async (data) => {
  const res = await API.post("/messages/send", data);

  return res.data;
};

export const getMessagesApi = async (conversationId) => {
  const res = await API.get(`/messages/${conversationId}`);

  return res.data;
};

export const clearMessagesApi = async (conversationId) => {
  const res = await API.delete(`/messages/${conversationId}/clear`);

  return res.data;
};
