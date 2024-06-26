type NFT = {
  nftId: number;
  price: number;
  currentDate: Date;
  stickerId: number;
  epicSaved: boolean;
};

export class TonNFTsAPI {
  public static async getNFTs(): Promise<NFT[]> {
    return [];
  }
}
