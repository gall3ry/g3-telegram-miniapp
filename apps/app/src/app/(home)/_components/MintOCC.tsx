"use client";
import { Button, Flex, Heading, Link, Text } from "@radix-ui/themes";
import { CHAIN } from "@tonconnect/protocol";
import { useNftContract } from "../../_hooks/useNftContract";
import { useTonConnect } from "../../_hooks/useTonConnect";
import { getNFTIdAndOwnerFromTx } from "../../utils/ton";

export function MintOCC() {
  const { connected } = useTonConnect();
  const { address, sendMintNft, sendMintNftFromFaucet } = useNftContract();
  const { network } = useTonConnect();

  return (
    <Flex direction="column" gap="4" mt="4">
      <Heading>MintOCC</Heading>
      <Text>
        Contract Address:
        <Link
          href={`https://${
            network == CHAIN.MAINNET ? "" : "testnet."
          }getgems.io/collection/${address}`}
        >
          {address}
        </Link>
      </Text>

      <Button
        type="submit"
        disabled={!connected}
        onClick={async () => {
          await sendMintNftFromFaucet({
            name: "Name Of NFT #6",
            description: "NFT Description",
            image:
              "ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg",
          });
        }}
      >
        Mint OCC
      </Button>

      <Button
        onClick={async () => {
          void getNFTIdAndOwnerFromTx(
            `588f65ef97cb28f3409be8ebba8dbcf9f8c7558d298357b08201dcc709a972f7`,
          ).then((res) => console.log(res));
        }}
      >
        Test get tx info
      </Button>
    </Flex>
  );
}
