import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatNumber = (num: number | null) => {
  if (num === null) return "N/A";
  return num.toLocaleString();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTonAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
