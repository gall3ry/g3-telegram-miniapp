import { getNFT } from './graphql';

type NFT = {
  nftId: number;
  price: number;
  image: string;
  metadata: any;
  name: string;
  nftAddress: string;
};

export class TonNFTsAPI {
  public static async getNFTs(walletAddress: string): Promise<NFT[]> {
    // Generate mock data
    return [
      {
        nftId: 1,
        price: 1000,
        image: 'https://placekitten.com/200/300',
        metadata: {
          name: 'NFT Name',
          description: 'NFT Description',
        },
        name: 'NFT Name',
        nftAddress: '0:',
      },
      {
        nftId: 2,
        price: 2000,
        image: 'https://placekitten.com/200/300',
        metadata: {
          name: 'NFT Name',
          description: 'NFT Description',
        },
        name: 'NFT Name',
        nftAddress: '0:',
      },
      {
        nftId: 3,
        price: 3000,
        image: 'https://placekitten.com/200/300',
        metadata: {
          name: 'NFT Name',
          description: 'NFT Description',
        },
        name: 'NFT Name',
        nftAddress: '0:',
      },
    ];
  }

  public static async getNFT(nftAddress: string): Promise<NFT> {
    const nft = await getNFT(nftAddress);

    // TODO: correct this
    return nft as any;
  }
}
