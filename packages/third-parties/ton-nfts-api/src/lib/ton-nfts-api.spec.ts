import { toBounceable } from '@gall3ry/shared-ton-utils';
import { TonNFTsAPI } from './ton-nfts-api';

describe('ton-nfts-api', () => {
  it('should return a nft info', async () => {
    // Arrange
    const nft = await TonNFTsAPI.getNFTs({
      walletAddress: toBounceable(
        '0:485177fd078a9f2b64e86d9e37ed2ea2f983869be10a933a757d38003c198bfd',
        true
      ),
    });

    console.log(nft);
  });
});
