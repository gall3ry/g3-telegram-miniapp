export enum COMMANDS {
  start = "start",
}

export const MAP_COMMAND_TO_DESCRIPTION: Record<COMMANDS, string> = {
  start: "Start command",
} as const;
