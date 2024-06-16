import { Alchemy, Network } from 'alchemy-sdk';

export const ALCHEMY_SETTINGS = {
  apiKey: '6MeDMz_tjh526e6f902pzqbGt9E2tutP',
  network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(ALCHEMY_SETTINGS);
