import { sharedMultichainSignatureValidation } from './shared-multichain-signature-validation';

describe('sharedMultichainSignatureValidation', () => {
  it('should work', () => {
    expect(sharedMultichainSignatureValidation()).toEqual(
      'shared-multichain-signature-validation'
    );
  });
});
