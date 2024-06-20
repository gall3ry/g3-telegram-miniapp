import { ValidationBlockchainType } from '@gall3ry/multichain-types';
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features';
import { verifySignIn } from '@solana/wallet-standard-util';

export class SolanaValidation implements ValidationBlockchainType {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateOrThrow(payload: {
    message: string;
    signature: string;
    nonce?: string;
    address?: string;
  }): Promise<{ address: string }> {
    // For solana, use the `validateSolanaMessage` method instead
    throw new Error('Method not implemented.');
  }

  async prepareMessage({
    address,
    uri,
  }: {
    address: string;
    uri: string;
  }): Promise<string> {
    const domain = new URL(uri).host;

    const signInData = {
      domain,
      statement:
        'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
      version: '1',
      address,
      nonce: 'oBbLoEldZs',
      chainId: 'mainnet',
      issuedAt: new Date().toISOString(),
      resources: [],
      expirationTime: new Date(
        new Date().getTime() + 1000 * 60 * 5
      ).toISOString(),
    } as const satisfies SolanaSignInInput;

    return JSON.stringify(signInData);
  }

  async validateSolanaMessage({
    input,
    output,
  }: {
    input: SolanaSignInInput;
    output: SolanaSignInOutput;
  }): Promise<{ address: string }> {
    const serialisedOutput: SolanaSignInOutput = {
      account: {
        ...output.account,
        publicKey: new Uint8Array(output.account.publicKey),
      },
      signature: new Uint8Array(output.signature),
      signedMessage: new Uint8Array(output.signedMessage),
    };
    const isVerified = verifySignIn(input, serialisedOutput);

    if (!isVerified) {
      throw new Error('Failed to verify signature');
    }

    if (!input.address) {
      throw new Error('Address is missing');
    }

    return {
      address: input.address,
    };
  }
}
