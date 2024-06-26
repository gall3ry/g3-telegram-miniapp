import { gql } from 'graphql-request';

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

export const marketPlaceDocument = gql`
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
