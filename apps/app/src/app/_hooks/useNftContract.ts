import { useState } from "react";
import NftCollection from "../contracts/NftCollection";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, toNano } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";
import { setItemContentCell } from "../contracts/nftContent/onChain";

const randomSeed = Math.floor(Math.random() * 10000);

export type mintArgs = {
  name: string;
  description: string;
  image: string;
};

export function useNftContract() {
  const { client } = useTonClient();
  const { sender, network } = useTonConnect();

  const nftContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new NftCollection(
      Address.parse(
        network === CHAIN.MAINNET
          ? "EQDLcS-wf4j9KFN5jtJ_sAOxnrv_x9rE6GCctQgkC2an6jQY"
          : "EQDzkXSigq_FQzQ6VYU-e84VgyRLk5avV2NxRiA5INjyepBe"
      )
    );
    return client.open(contract) as OpenedContract<NftCollection>;
  }, [client]);

  return {
    address: nftContract?.address.toString(),
    sendMintNft: (args: mintArgs) => {
      return nftContract?.sendMintNft(sender, {
        value: toNano("0.02"),
        queryId: randomSeed,
        amount: toNano("0.014"),
        itemIndex: 0,
        itemOwnerAddress: sender.address!!,
        itemContent: setItemContentCell({
          name: args.name,
          description: args.description,
          image: args.image,
        })
      });
    },
  };
}
