// api/contact.api.js

import API from "@/lib/axios";

export const add = async (data) => {
  const res = await API.post("/contacts/add", data);

  return res.data;
};

export const getContacts = async () => {
  const res = await API.get("/contacts");

  return res.data;
};
