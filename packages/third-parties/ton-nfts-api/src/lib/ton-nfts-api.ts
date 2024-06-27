import TonWeb from 'tonweb';
import { getMultipleNftsByOwner, getSingleNftByAddress } from './graphql';
const Address = TonWeb.utils.Address;

type NFT = {
  nftId: number;
  nftName: string;
  price: string;
  image: string;
  currentDate: Date;
  nftAddress: string;
  stickerCreationDaysCount: Date | null;
};

export class TonNFTsAPI {
  public static async getNFTs({
    walletAddress,
    limit,
    cursor,
  }: {
    walletAddress: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    items: NFT[];
    limit: number;
    cursor: string;
  }> {
    const res = await getMultipleNftsByOwner(walletAddress, limit, cursor);

    const items = res.items.map((nft) => {
      const price =
        nft.sale?.lastBidAmount ??
        nft.sale?.fullPrice ??
        nft.maxOffer?.fullPrice ??
        '0';
      return {
        nftId: Number(nft.index),
        nftName: nft.name,
        price: price,
        image: nft.content.image.baseUrl,
        currentDate: new Date(),
        nftAddress: new Address(nft.address).toString(true, true),
        stickerCreationDaysCount: null,
      };
    });
    return {
      items,
      limit: res.limit,
      cursor: res.cursor,
    };
  }

  public static async getNFT(nftAddress: string): Promise<NFT> {
    const nftInfo = await getSingleNftByAddress(nftAddress);
    if (!nftInfo) {
      throw new Error('Failed to fetch NFT info');
    }
    const price =
      nftInfo.sale?.lastBidAmount ??
      nftInfo.sale?.fullPrice ??
      nftInfo.maxOffer?.fullPrice ??
      '0';

    return {
      nftId: nftInfo.index,
      nftName: nftInfo.name,
      price: price,
      image: nftInfo.content.image.baseUrl,
      currentDate: new Date(),
      nftAddress: nftInfo.address,
      stickerCreationDaysCount: null,
      // stickerCreationDaysCount: Math.floor(
      //   (new Date().getTime() - sticker.createdAt.getTime()) /
      //     (1000 * 60 * 60 * 24)
      // ), // For cat GM
    };
  }
}
