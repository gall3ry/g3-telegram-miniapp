import { CHAIN } from "@tonconnect/protocol";
import { Address, toNano } from "ton-core";
import NftCollection from "../contracts/NftCollection";
import { setItemContentCell } from "../contracts/nftContent/onChain";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

const randomSeed = Math.floor(Math.random() * 10000);

export type mintArgs = {
  name: string;
  description: string;
  image: string;
};

export function useNftContract() {
  const { client } = useTonClient();
  const { sender, network, wallet } = useTonConnect();

  const nftContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new NftCollection(
      Address.parse(
        network === CHAIN.MAINNET
          ? "EQDLcS-wf4j9KFN5jtJ_sAOxnrv_x9rE6GCctQgkC2an6jQY"
          : "EQDzkXSigq_FQzQ6VYU-e84VgyRLk5avV2NxRiA5INjyepBe",
      ),
    );
    return client.open(contract);
  }, [client]);

  return {
    address: nftContract?.address.toString(),
    sendMintNft: (args: mintArgs) => {
      if (!nftContract) throw new Error("Contract not initialized");

      if (!wallet) throw new Error("Wallet not initialized");

      return nftContract.sendMintNft(sender, {
        value: toNano("0.01"),
        queryId: randomSeed,
        amount: toNano("0.014"),
        itemIndex: 0,
        itemOwnerAddress: Address.parse(wallet),
        itemContent: setItemContentCell({
          name: args.name,
          description: args.description,
          image: args.image,
        }),
      });
    },
  };
}
