import { PrismaService } from '@g3-worker/prisma-client';
import { Prisma } from '@gall3ry/database-client';
import { toBounceable } from '@gall3ry/shared-ton-utils';
import { TonNFTsAPI } from '@gall3ry/third-parties-ton-nfts-api';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class G3WorkerNftCrawlingService {
  private readonly logger = new Logger(G3WorkerNftCrawlingService.name);

  constructor(private db: PrismaService) {}

  // 2 minutes for testing
  @Cron('*/10 * * * * *')
  async crawlNFTs() {
    const db = this.db;

    Logger.debug('[crawlNFTs] Start');

    const occList = await db.occ.findMany({
      where: {
        GMSymbolOCC: {
          nftLastUpdatedAt: null,
        },
      },
      include: {
        GMSymbolOCC: {
          select: {
            id: true,
          },
        },
      },
    });

    if (occList.length === 0) {
      return;
    }

    Logger.debug(`[crawlNFTs] Found ${occList.length} OCCs`);

    await Promise.all(
      occList.map(async (occ) => {
        const providerList = await db.provider.findMany({
          where: {
            id: occ.providerId,
          },
        });

        return Promise.all(
          providerList.map(async (provider) => {
            const { type } = provider;

            switch (type) {
              case 'TON_WALLET': {
                try {
                  const res: Awaited<
                    ReturnType<typeof TonNFTsAPI.getNFTs>
                  > | null = await TonNFTsAPI.getNFTs({
                    walletAddress: toBounceable(provider.value),
                    limit: 100,
                  }).catch((e) => {
                    Logger.error(e);
                    console.log(e);
                    return null;
                  });

                  Logger.log(
                    `Fetched ${res.items.length} NFTs from ${provider.value}`
                  );

                  if (!res) {
                    console.log(`break ${provider.value}`);
                    break;
                  }

                  const { items: nfts } = res;
                  // get all nfts that is not exist any more
                  const removedNfts = await db.gMNFT.findMany({
                    where: {
                      gMSymbolOCCId: occ.GMSymbolOCC.id,
                      nftAddress: {
                        notIn: nfts.map(({ nftAddress }) => nftAddress),
                      },
                    },
                  });

                  if (removedNfts.length > 0) {
                    // TODO: add action for deleted gmNFTs, should we delete their sticker or not
                    // await db.gMNFT.deleteMany({
                    //   where: {
                    //     id: {
                    //       in: removedNfts.map(({ id }) => id),
                    //     },
                    //   },
                    // });

                    Logger.log(
                      `Removed NFTs: ${JSON.stringify(
                        removedNfts.map(({ id }) => id)
                      )}`
                    );
                  }
                  const data = nfts.map(
                    ({ image, nftName, nftAddress, nftId, price }) => {
                      return {
                        nftAddress: nftAddress,
                        imageUrl: image,
                        gMSymbolOCCId: occ.GMSymbolOCC.id,
                        templateMetadata: {
                          nftName,
                          price,
                          nftId,
                        },
                      } satisfies Prisma.GMNFTCreateManyInput;
                    }
                  );

                  console.log(`data`, data);

                  const createdNfts = await db.gMNFT.createManyAndReturn({
                    skipDuplicates: true,
                    data: data,
                  });

                  Logger.debug(
                    `Created NFTs: ${JSON.stringify(
                      createdNfts.map(({ id }) => id)
                    )}`
                  );
                } catch (e) {
                  Logger.error(e);
                } finally {
                  // update last updated at
                  await db.gMSymbolOCC.update({
                    where: {
                      id: occ.GMSymbolOCC.id,
                    },
                    data: {
                      nftLastUpdatedAt: new Date(),
                    },
                  });
                }

                break;
              }
              default: {
                // do nothing
                break;
              }
            }
          })
        );
      })
    );

    Logger.debug('[crawlNFTs] Done');
  }
}
