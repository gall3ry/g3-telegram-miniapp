import { TonNFTsAPI } from './ton-nfts-api';

describe('ton-nfts-api', () => {
  it('should return a nft info', async () => {
    // Arrange
    const nft = await TonNFTsAPI.getNFT(
      'EQB8NAlKfN_1YjjdhO9mCMwGGVkq6yFITeD7EKeZse0lv9kJ'
    );

    console.log(nft);
  });
});
