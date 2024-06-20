import { ValidationBlockchainType } from '@gall3ry/multichain-types';

export class TonValidation implements ValidationBlockchainType {
  async validateOrThrow({
    address,
  }: {
    message: string;
    signature: string;
    nonce?: string;
    address?: string;
  }) {
    if (!address) {
      throw new Error('Invalid address');
    }

    return {
      address,
    };
  }

  async prepareMessage({ address }: { address: string }): Promise<string> {
    return '';
  }
}
