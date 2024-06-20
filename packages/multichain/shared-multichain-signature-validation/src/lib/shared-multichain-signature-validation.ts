import {
  BLOCKCHAIN_TYPES,
  ValidationBlockchainType,
} from '@gall3ry/multichain-types';
import { EVMValidation } from './evm-validation';
import { SolanaValidation } from './solana-validation';
import { TonValidation } from './ton-validation';

export const multichainSignatureValidationList: Record<
  keyof typeof BLOCKCHAIN_TYPES,
  ValidationBlockchainType
> = {
  EVM_WALLET: new EVMValidation(),
  SOLANA_WALLET: new SolanaValidation(),
  TON_WALLET: new TonValidation(),
};
