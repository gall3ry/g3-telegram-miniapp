"use client";
import { Text, Heading, Button, Flex, Link } from "@radix-ui/themes";
import { useTonConnect } from "../../_hooks/useTonConnect";
import { useNftContract } from "../../_hooks/useNftContract";
import { CHAIN } from "@tonconnect/protocol";

export function MintOCC() {
  const { connected } = useTonConnect();
  const { address, sendMintNft } = useNftContract();
  const { network } = useTonConnect();

  return (
    <Flex direction="column" gap="4">
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
          sendMintNft({
            name: "Name Of NFT",
            description: "NFT Description",
            image: "ipfs://QmTPSH7bkExWcrdXXwQvhN72zDXK9pZzH3AGbCw13f6Lwx/logo.jpg",
          });
        }}
      >
        Mint OCC
      </Button>
    </Flex>
  );
}
