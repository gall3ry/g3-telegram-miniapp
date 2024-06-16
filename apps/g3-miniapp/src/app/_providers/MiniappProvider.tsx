"use client";
import { initMiniApp, type MiniApp } from "@tma.js/sdk-react";
import { useEffect } from "react";
import { create } from "zustand";

export const useMiniApp = create<{
  miniApp: MiniApp | null;
  setMiniApp: (miniApp: MiniApp) => void;
}>((set) => ({
  miniApp: null,
  setMiniApp: (miniApp) => set({ miniApp }),
}));

export const MiniappProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setMiniApp } = useMiniApp();
  useEffect(() => {
    if (!setMiniApp) return;

    const [miniApp, cleanUp] = initMiniApp();

    setMiniApp(miniApp);

    return cleanUp;
  }, [setMiniApp]);

  return <>{children}</>;
};
