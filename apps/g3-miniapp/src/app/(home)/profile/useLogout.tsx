"use client";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback } from "react";
import { toast } from "react-hot-toast";

export const useLogout = () => {
  const [tonConnectUI] = useTonConnectUI();
  const logout = useCallback(() => {
    tonConnectUI.disconnect().catch(() => {
      toast.error("Failed to disconnect");
    });
  }, [tonConnectUI]);

  return {
    logout,
  };
};
