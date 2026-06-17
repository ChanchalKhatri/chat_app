import API from "@/lib/axios";

// ================= LOGIN =================
export const loginUser = async (data) => {
  const response = await API.post("/users/login", data);

  return response.data;
};

// ================= REGISTER =================
export const registerUser = async (data) => {
  const response = await API.post("/users/register", data);

  return response.data;
};
