const SUPPORTED_CHAT_TYPES = ["group", "supergroup"] as const;

export const isChatTypeSupported = (chatType: string | undefined) =>
  SUPPORTED_CHAT_TYPES.includes(chatType as any);
