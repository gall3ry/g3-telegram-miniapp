import { env } from '@gall3ry/g3-miniapp-env';
import { BLOCKCHAIN_TYPES } from '@gall3ry/multichain-types';
import {
  multichainSignatureValidationList,
  SolanaValidation,
} from '@gall3ry/multichain/shared-multichain-signature-validation';
import { ProviderType } from '@prisma/client';
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features';
import { parse, validate } from '@tma.js/init-data-node';
import { destr } from 'destr';
import { generateNonce } from 'siwe';
import { z } from 'zod';
import { db } from '../../../db';
import { AuthenticationService } from '../../services/authentication';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { checkProof, connectMoreProvider } from './checkProof';
import { generatePayload } from './generatePayload';
import { getCurrentUser } from './getCurrentUser';
import { getMyStats } from './getMyStats';
import { updateDisplayName } from './updateDisplayName';

export const authRouter = createTRPCRouter({
  checkProof: checkProof,
  connectMoreProvider: connectMoreProvider,
  generatePayload: generatePayload,
  getCurrentUser: getCurrentUser,
  getMyStats,
  getNonce: publicProcedure.query(() => {
    return {
      nonce: generateNonce(),
    };
  }),
  signIn: publicProcedure
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
        z.object({
          type: z.enum([ProviderType.TELEGRAM]),
          dataCheckString: z.string(),
        }),
      ])
    )
    .mutation(async ({ input }) => {
      const type = input.type;
      let value: string;

      switch (type) {
        case 'SOLANA_WALLET': {
          const validator = multichainSignatureValidationList[type];
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

          value = (await _validator.validateSolanaMessage(payload)).address;

          break;
        }
        case 'TELEGRAM': {
          const { dataCheckString } = input;
          const botToken = env.BOT_TOKEN;

          validate(dataCheckString, botToken, {
            expiresIn: 0,
          });

          const authData = parse(dataCheckString);
          const id = z.coerce.number().parse(authData.user?.id);

          value = id.toString();

          break;
        }
        default: {
          const validator = multichainSignatureValidationList[type];
          const { message, signature, address: _address } = input;
          value = (
            await validator.validateOrThrow({
              message,
              signature,
              address: _address,
            })
          ).address;
        }
      }

      const { token, userId } =
        await AuthenticationService.upsertUserWithProvider({
          value,
          providerType: type,
        });

      if (type === 'TELEGRAM') {
        const authData = parse(input.dataCheckString);

        if (authData.user.username) {
          await db.user.updateMany({
            data: {
              displayName: authData.user.username,
            },
            where: {
              id: userId,
              displayName: null,
            },
          });
        }
      }

      return {
        token,
      };
    }),
  updateDisplayName,
});
