import { getNFT, NftInfo } from './graphql';

type NFT = {
  nftId: number;
  price: number;
  image: string;
  metadata: NftInfo;
  name: string;
  nftAddress: string;
};

export class TonNFTsAPI {
  public static async getNFTs(walletAddress: string): Promise<NFT[]> {
    return [];
  }

  public static async getNFT(nftAddress: string): Promise<NFT> {
    const nft = await getNFT(nftAddress);

    // TODO: correct this
    return nft as any;
  }
}
