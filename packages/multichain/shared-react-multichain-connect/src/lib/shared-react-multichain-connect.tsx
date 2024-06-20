import {
  BLOCKCHAIN_TYPES,
  FrontendConnectType,
} from '@gall3ry/multichain-types';
import { EVMConnect } from './evm/evm-connect';
import { SolanaConnect } from './solana/solana-connect';
import { TonConnect } from './ton/ton-connect';

export const multichainConnectComponent: Record<
  keyof typeof BLOCKCHAIN_TYPES,
  FrontendConnectType
> = {
  EVM_WALLET: new EVMConnect(),
  SOLANA_WALLET: new SolanaConnect(),
  TON_WALLET: new TonConnect(),
};
