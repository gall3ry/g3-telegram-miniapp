export abstract class ValidationBlockchainType {
  abstract validate({
    message,
    walletAddress,
  }: {
    message: string;
    walletAddress: string;
  }): Promise<boolean>;
}
