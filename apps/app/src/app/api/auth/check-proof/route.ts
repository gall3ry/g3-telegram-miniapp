import { type NextApiRequest, type NextApiResponse } from "next";
import { CheckProofRequest } from "../../_dto/check-proof-request-dto";
import { TonApiService } from "../../_services/ton-api-service";
import { TonProofService } from "../../_services/ton-proof-service";
import { createAuthToken, verifyToken } from "../../_utils/jwt";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  const { address, network, proof, public_key } = CheckProofRequest.parse(body);

  const client = TonApiService.create(network);

  const isValid = await TonProofService.checkProof(
    {
      address,
      public_key,
      proof,
      network,
    },
    (address) => client.getWalletPublicKey(address),
  );
  if (!isValid) {
    return res.status(400).json({ error: "Invalid proof" });
  }

  const payloadToken = proof.payload;
  if (!(await verifyToken(payloadToken))) {
    // return badRequest({ error: "Invalid token" });

    return res.status(400).json({ error: "Invalid token" });
  }

  const token = await createAuthToken({
    address: address,
    network: network,
  });

  return res.status(200).json({ token: token });
};
