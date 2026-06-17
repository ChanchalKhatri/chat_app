import API from "@/lib/axios";

// CREATE OR GET CONVERSATION
export const createOrGetConversationApi = async (receiverId) => {
  const res = await API.post("/conversation/create", {
    receiverId,
  });

  return res.data;
};

// GET ALL MY CONVERSATIONS
export const getMyConversationsApi = async () => {
  const res = await API.get("/conversation");

  return res.data;
};
