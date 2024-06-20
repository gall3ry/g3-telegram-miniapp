import { ValidationBlockchainType } from '@gall3ry/multichain-types';

export class EVMValidation implements ValidationBlockchainType {
  async validateOrThrow({
    message,
    signature,
    nonce,
    address,
  }: {
    message: string;
    signature: string;
    nonce?: string;
    address: string;
  }) {
    const { SiweMessage } = await import('siwe');
    let siweMessage;

    try {
      siweMessage = new SiweMessage(message);
    } catch (error) {
      console.error(error);
      throw new Error('Invalid message');
    }

    const result = await siweMessage.verify({
      signature,
      nonce,
    });

    if (!result.success) {
      throw new Error('Invalid signature');
    }

    if (address && address !== result.data.address) {
      console.error(
        'Signature address does not match',
        address,
        result.data.address
      );
      throw new Error('Signature address does not match');
    }

    return {
      address,
    };
  }

  async prepareMessage({
    address,
    uri,
  }: {
    address: string;
    uri: string;
  }): Promise<string> {
    const { SiweMessage } = await import('siwe');
    const domain = new URL(uri).hostname;

    return new SiweMessage({
      address,
      statement: 'Sign in with Ethereum to the app.',
      version: '1',
      chainId: 1,
      domain: domain,
      uri: uri,
      // ISO 8601
      expirationTime: `${new Date(Date.now() + 1000 * 60).toISOString()}`,
    }).prepareMessage();
  }
}
