import { FrontendConnectType } from '@gall3ry/multichain-types';
import { LoginButton } from './LoginButton';

export class SolanaConnect implements FrontendConnectType {
  connectAndSignMessage(): React.FC {
    return LoginButton;
  }
}
