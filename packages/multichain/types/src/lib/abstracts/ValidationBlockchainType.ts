import { z } from 'zod';

export abstract class ValidationBlockchainType {
  static prepareMessagePayload = z.object({
    address: z.string(),
    uri: z.string().url(),
  });

  abstract validateOrThrow(payload: {
    message: string;
    signature: string;
    nonce?: string;
    // wallet address
    address?: string;
  }): Promise<{
    address: string;
  }>;

  abstract prepareMessage({
    address,
    uri,
  }: z.infer<
    typeof ValidationBlockchainType.prepareMessagePayload
  >): Promise<string>;
}
