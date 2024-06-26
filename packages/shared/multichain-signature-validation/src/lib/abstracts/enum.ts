export enum BLOCKCHAIN_TYPES {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
  TON = 'TON',
}

export const SUPPORTED_BLOCKCHAIN_TYPES = [
  BLOCKCHAIN_TYPES.EVM,
  BLOCKCHAIN_TYPES.SOLANA,
  BLOCKCHAIN_TYPES.TON,
] as const;
