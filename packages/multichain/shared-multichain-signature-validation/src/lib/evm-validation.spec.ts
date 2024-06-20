import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { EVMValidation } from './evm-validation';

describe('EVM Signature Validation', () => {
  it('should validate signature', async () => {
    const account = privateKeyToAccount(generatePrivateKey());
    const { address } = account;

    // Arrange
    const evmValidation = new EVMValidation();
    const message = await evmValidation.prepareMessage({
      address,
      uri: 'https://example.com',
    });

    const signature = await account.signMessage({
      message: message,
    });

    expect(
      await evmValidation.validateOrThrow({
        message: message,
        signature,
        address,
      })
    ).toStrictEqual({
      address,
    });
  });
});
