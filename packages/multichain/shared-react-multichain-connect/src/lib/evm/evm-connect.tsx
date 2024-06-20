'use client';
import { FrontendConnectType } from '@gall3ry/multichain-types';
import { ConnectButton } from './ConnectButton';

export class EVMConnect implements FrontendConnectType {
  connectAndSignMessage = () => ConnectButton;
}
