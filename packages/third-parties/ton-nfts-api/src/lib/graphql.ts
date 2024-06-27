import axios from 'axios';

export type NftInfo = {
  address: string;
  ownerAddress: string;
  name: string;
  index: number;
  maxOffer: {
    fullPrice: string | null;
  } | null;
  sale: {
    maxBid: string | null;
    minBid: string | null;
    lastBidAmount: string | null;
  } | null;
  content: {
    image: {
      baseUrl: string | null;
    } | null;
  } | null;
};

export const marketPlaceUrl = 'https://api.getgems.io/graphql/';

export const marketPlaceDocument = `
  query ($address: String!) {
    alphaNftItemByAddress(address: $address) {
      address
      ownerAddress
      name
      index
      maxOffer {
        fullPrice
      }
      sale {
        ... on NftSaleAuction {
          maxBid
          minBid
          lastBidAmount
        }
        ... on NftSaleFixPrice {
          fullPrice
        }
      }
      content {
        ... on NftContentImage {
          image {
            baseUrl
          }
        }
      }
    }
  }
`;

export const getNFT = async (nftAddress: string): Promise<NftInfo> => {
  const res = await axios.post(marketPlaceUrl, {
    query: marketPlaceDocument,
    variables: {
      address: nftAddress,
    },
  });

  console.log(res.data);

  if (!res.data.data.alphaNftItemByAddress) {
    throw new Error('NFT not found');
  }

  return res.data;
};
