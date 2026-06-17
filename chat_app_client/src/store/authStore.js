import { create } from "zustand";

const useAuthStore = create((set) => ({
  isLogin: localStorage.getItem("isLogin") === "true",
  token: localStorage.getItem("token") || null,
  user: (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),

  login: (token, user) => {
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ isLogin: true, token, user });
  },

  logout: () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ isLogin: false, token: null, user: null });
  },

  updateUser: (updatedFields) => {
    set((state) => {
      const newUser = state.user ? { ...state.user, ...updatedFields } : updatedFields;
      localStorage.setItem("user", JSON.stringify(newUser));
      return { user: newUser };
    });
  },
}));

export default useAuthStore;
