import { ValidationBlockchainType } from '../abstracts/ValidationBlockchainType';

export class EVMValidation implements ValidationBlockchainType {
  validate({
    message,
    walletAddress,
  }: {
    message: string;
    walletAddress: string;
  }): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
