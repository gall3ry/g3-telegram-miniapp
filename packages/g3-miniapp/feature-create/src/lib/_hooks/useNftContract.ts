import { CHAIN } from '@tonconnect/protocol';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from 'ton-core';
import { v4 as uuidv4 } from 'uuid';
import NftCollection from '../_contracts/NftCollection';
import { setItemContentCell } from '../_contracts/nftContent/onChain';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

const randomSeed = Math.floor(Math.random() * 10000);

export type mintArgs = {
  name: string;
  description: string;
  image: string;
};

export function useNftContract() {
  const { client } = useTonClient();
  const { sender, network, wallet } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();

  const nftContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new NftCollection(
      Address.parse(
        network === CHAIN.MAINNET
          ? 'EQDse2YhJlXweEKkbAWvkyla36VXUywdapUXyvvlWBHl7aPQ'
          : 'EQDzkXSigq_FQzQ6VYU-e84VgyRLk5avV2NxRiA5INjyepBe'
      )
    );
    return client.open(contract);
  }, [client]);

  return {
    address: nftContract?.address.toString(),
    sendMintNft: (args: mintArgs) => {
      if (!nftContract) throw new Error('Contract not initialized');
      if (!wallet) throw new Error('Wallet not initialized');

      return nftContract.sendMintNft(sender, {
        value: toNano('0.01'),
        queryId: randomSeed,
        amount: toNano('0.014'),
        itemIndex: 0,
        itemOwnerAddress: Address.parse(wallet),
        itemContent: setItemContentCell({
          name: args.name,
          description: args.description,
          image: args.image,
        }),
      });
    },
    sendMintNftFromFaucet: async (args: mintArgs) => {
      if (!nftContract) throw new Error('Nft contract not initialized');
      if (!wallet) throw new Error('Wallet not initialized');
      const nftMessage = beginCell();
      nftMessage.storeAddress(Address.parse(wallet));
      nftMessage.storeRef(
        setItemContentCell({
          name: args.name,
          description: args.description,
          image: args.image,
        })
      );
      const body = beginCell()
        .storeUint(1, 32) // operation
        .storeUint(randomSeed, 64)
        .storeUint(0, 64)
        .storeCoins(toNano('0.014'))
        .storeRef(nftMessage) // body
        .endCell();
      const boc = await tonConnectUI.sendTransaction({
        messages: [
          {
            address: nftContract.address.toString(),
            amount: toNano('0.02').toString(),
            payload: body.toBoc().toString('base64'),
          },
        ],
        validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
      });
      // TODO: Use real txHash and nftAddress later - now just for recording
      // const txhash = await getTxByBOC(boc.boc, wallet);
      const txhash = uuidv4();

      console.log('txhash', txhash);

      return txhash;
    },
  };
}
