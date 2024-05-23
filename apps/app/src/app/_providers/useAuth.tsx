"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create<{
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  reset: () => void;
}>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      reset: () => set({ accessToken: null }),
    }),
    {
      name: "miniapp-auth",
    },
  ),
);
