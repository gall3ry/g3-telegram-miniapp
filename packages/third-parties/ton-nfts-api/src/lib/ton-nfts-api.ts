import { marketPlaceDocument, marketPlaceUrl, NftInfo } from './graphql';

type NFT = {
  nftId: number;
  price: number;
  currentDate: Date;
  stickerId: number;
  epicSaved: boolean;
};

export class TonNFTsAPI {
  public static async getNFTs(walletAddress: string): Promise<NFT[]> {
    return [];
  }

  public static async getNFT(nftAddress: string): Promise<NFT> {
    const { request } = await import('graphql-request');
    const res = (await request(marketPlaceUrl, marketPlaceDocument, {
      address: nftAddress,
    })) as {
      alphaNftItemByAddress: NftInfo;
    };
    console.log(res);
    if (!res.alphaNftItemByAddress) {
      throw new Error('NFT not found');
    }

    return {
      nftId: 1,
      price: 100,
      currentDate: new Date(),
      stickerId: 1,
      epicSaved: true,
    };
  }
}
