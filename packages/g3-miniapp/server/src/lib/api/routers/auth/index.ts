import { BLOCKCHAIN_TYPES } from '@gall3ry/multichain-types';
import {
  multichainSignatureValidationList,
  SolanaValidation,
} from '@gall3ry/multichain/shared-multichain-signature-validation';
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features';
import { destr } from 'destr';
import { generateNonce } from 'siwe';
import { z } from 'zod';
import { AuthenticationService } from '../../services/authentication';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { checkProof } from './checkProof';
import { generatePayload } from './generatePayload';
import { getCurrentUser } from './getCurrentUser';
import { getMyStats } from './getMyStats';
import { updateDisplayName } from './updateDisplayName';

export const authRouter = createTRPCRouter({
  checkProof: checkProof,
  generatePayload: generatePayload,
  getCurrentUser: getCurrentUser,
  updateDisplayName,
  getMyStats,
  getNonce: publicProcedure.query(() => {
    return {
      nonce: generateNonce(),
    };
  }),
  web3SignIn: publicProcedure
    .input(
      z.discriminatedUnion('type', [
        z.object({
          type: z.enum([
            BLOCKCHAIN_TYPES.EVM_WALLET,
            BLOCKCHAIN_TYPES.TON_WALLET,
          ]),
          message: z.string(),
          signature: z.string(),
          address: z.string(),
        }),
        z.object({
          type: z.enum([BLOCKCHAIN_TYPES.SOLANA_WALLET]),
          input: z.string(),
          output: z.string(),
        }),
      ])
    )
    .mutation(async ({ input }) => {
      const type = input.type;

      const validator = multichainSignatureValidationList[type];
      let address: string;

      switch (type) {
        case 'SOLANA_WALLET': {
          const _validator = validator as SolanaValidation;
          const _input = destr<SolanaSignInInput>(input.input);
          const _output = destr<{
            account: SolanaSignInOutput['account'];
            signature: {
              name: 'Buffer';
              data: number[];
            };
            signedMessage: {
              name: 'Buffer';
              data: number[];
            };
          }>(input.output);

          const payload: {
            input: SolanaSignInInput;
            output: SolanaSignInOutput;
          } = {
            input: _input,
            output: {
              account: {
                ..._output.account,
                publicKey: new Uint8Array(
                  Object.values(_output.account.publicKey)
                ),
              },
              signature: new Uint8Array(_output.signature.data),
              signedMessage: new Uint8Array(_output.signedMessage.data),
            },
          };

          address = (await _validator.validateSolanaMessage(payload)).address;

          break;
        }
        default: {
          const { message, signature, address: _address } = input;
          address = (
            await validator.validateOrThrow({
              message,
              signature,
              address: _address,
            })
          ).address;
        }
      }

      const { token } = await AuthenticationService.createUserWithProvider({
        address,
        providerType: type,
      });

      return {
        token,
      };
    }),
});
