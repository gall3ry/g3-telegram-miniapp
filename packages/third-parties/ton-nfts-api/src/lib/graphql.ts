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
    fullPrice: string | null;
  } | null;
  content: {
    image: {
      baseUrl: string | null;
    } | null;
  } | null;
};

export const marketPlaceUrl = 'https://api.getgems.io/graphql/';

export const singleNftByAddressDocument = `
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

export const multipleNftsByOwnerDocument = `
  query ($address: String!, $limit: Int!, $cursor: String) {
    nftItemsByOwner(first: $limit, ownerAddress: $address, after: $cursor) {
    cursor
    items {
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
  }
`;
/**
 * Get single Nft info by address.
 */

export async function getSingleNftByAddress(nftAddress: string) {
  const headers = {
    'content-type': 'application/json',
  };

  const options = {
    method: 'POST',
    headers: headers,
    query: singleNftByAddressDocument,
    variables: {
      address: nftAddress,
    },
  };
  const res = await axios
    .post(marketPlaceUrl, options)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Failed to fetch NFT info');
    });
  if (!res.data?.data) {
    throw new Error('NFT not found');
  }
  return res.data.data.alphaNftItemByAddress as NftInfo;
}
/**
 * Get Multiple Nft info by owner.
 */

export async function getMultipleNftsByOwner(
  ownerAddress: string,
  limit?: number,
  cursor?: string
) {
  const headers = {
    'content-type': 'application/json',
  };
  if (!limit) {
    limit = 100;
  }
  const options = {
    method: 'POST',
    headers: headers,
    query: multipleNftsByOwnerDocument,
    variables: {
      address: ownerAddress,
      limit: limit ?? 100,
      cursor: cursor ?? '',
    },
  };
  const res = await axios
    .post<{ data: { nftItemsByOwner: { items: NftInfo[]; cursor: string } } }>(
      marketPlaceUrl,
      options
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Failed to fetch NFT info');
    });

  return {
    items: res.data.data.nftItemsByOwner.items,
    limit: limit,
    cursor: res.data.data.nftItemsByOwner.cursor,
  };
}
