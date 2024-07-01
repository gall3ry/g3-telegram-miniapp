import { TonTokenApi } from './third-parties-token-api';

describe('thirdPartiesTokenApi', () => {
  const client = new TonTokenApi(process.env.TONCONSOLE_API_KEY);
  it('should return tokens by owner', async () => {
    // Arrange
    const tokens = await client.getTokensByOwner({
      walletAddress: 'UQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__I5W',
      limit: 10,
      page: 1,
    });
    console.log(tokens);
    expect(tokens).toBeDefined();
  });

  it('should return tokens by many owner', async () => {
    // Arrange
    const res = await client.getTokensByOwnerBatch([
      {
        walletAddress: 'UQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__I5W',
        limit: 10,
        page: 1,
      },
      {
        walletAddress: 'EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2',
        limit: 10,
        page: 1,
      },
    ]);
    expect(res).toBeDefined();
  });
});
