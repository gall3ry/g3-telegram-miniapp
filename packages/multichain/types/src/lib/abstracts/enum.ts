import { ProviderType } from '@prisma/client';

export const BLOCKCHAIN_TYPES = {
  [ProviderType.EVM_WALLET]: ProviderType.EVM_WALLET,
  [ProviderType.SOLANA_WALLET]: ProviderType.SOLANA_WALLET,
  [ProviderType.TON_WALLET]: ProviderType.TON_WALLET,
} as const satisfies Record<string, ProviderType>;
