import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatNumber = (num: number | null) => {
  if (num === null) return "N/A";
  return num.toLocaleString();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
