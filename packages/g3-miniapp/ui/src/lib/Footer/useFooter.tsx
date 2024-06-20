'use client';
import { create } from 'zustand';

type Footer = {
  footer: React.ReactNode;
  setFooter: (footer: React.ReactNode) => void;
};

export const useFooter = create<Footer>()((set) => ({
  footer: null,
  setFooter: (footer) => set({ footer }),
}));
