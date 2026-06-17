// api/status.api.js

import API from "@/lib/axios";

export const createStatusApi = async (data) => {
  const res = await API.post("/status/create", data);

  return res.data;
};

export const getMyStatusesApi = async () => {
  const res = await API.get("/status/my");

  return res.data;
};

export const getContactStatusesApi = async () => {
  const res = await API.get("/status/contacts");

  return res.data;
};

export const viewStatusApi = async (statusId) => {
  const res = await API.post(`/status/${statusId}/view`);

  return res.data;
};

export const deleteStatusApi = async (statusId) => {
  const res = await API.delete(`/status/${statusId}`);

  return res.data;
};
