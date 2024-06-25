'use client';
import { useAutoTelegramLogin } from './useAutoTelegramLogin';
import { useWaitAndConnectProvider } from './useWaitAndConnectProvider';

export const BackendAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useWaitAndConnectProvider();
  useAutoTelegramLogin();

  return children;
};
