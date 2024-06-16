import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formatNumber = (num: number | null) => {
  if (num === null) return 'N/A';
  return num.toLocaleString();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTonAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const delay = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export async function tryNTimes<T>({
  toTry,
  times = 5,
  interval = 1,
}: {
  toTry: () => Promise<T>;
  times?: number;
  interval?: number;
}) {
  if (times < 1)
    throw new Error(
      `Bad argument: 'times' must be greater than 0, but ${times} was received.`
    );
  let attemptCount = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await toTry();
      return result;
    } catch (error) {
      if (++attemptCount >= times) throw error;
    }
    await delay(interval);
  }
}
