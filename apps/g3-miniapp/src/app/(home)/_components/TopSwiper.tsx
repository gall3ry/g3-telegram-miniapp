'use client';
import { Button } from '@radix-ui/themes';
import { useInitData } from '@tma.js/sdk-react';
import { memo } from 'react';
import { EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { z } from 'zod';
import { api } from '../../../trpc/react';
import { IconTelegram } from '../_icons/IconTelegram';
import { useWebAppSwitchInlineQuery } from '../create/useWebAppSwitchInlineQuery';
import { mapStickerTypeToTemplateComponent } from './_templates';

export const TopSwiper = memo(() => {
  const { data } = api.sticker.getTopStickers.useQuery({
    limit: 10,
  });
  const { postSwitchInlineQuery } = useWebAppSwitchInlineQuery();
  const initData = useInitData(true);
  const items = data?.items;

  return (
    <div className="mt-6">
      <Swiper
        slidesPerView="auto"
        className="w-full bg-cover"
        effect="coverflow"
        modules={[EffectCoverflow]}
        centeredSlides
        initialSlide={2}
      >
        {items?.map((item, index) => (
          <SwiperSlide
            key={index}
            className="bg-[#EDFFF4] rounded-lg p-3"
            style={{
              width: '70%',
            }}
          >
            <div className="aspect-square w-full bg-cover bg-no-repeat">
              {mapStickerTypeToTemplateComponent(item.stickerType, {
                imageUrl:
                  item.GMNFT.imageUrl || 'https://via.placeholder.com/150',
                stickerTitle: `STICKER #${item.id}`,
              })}
            </div>

            <div className="mt-3">
              <Button
                size="4"
                className="w-full"
                onClick={() => {
                  const { telegramUserId } = z
                    .object({
                      telegramUserId: z.coerce.number(),
                    })
                    .parse({
                      telegramUserId: initData?.user?.id,
                    });

                  postSwitchInlineQuery({
                    query: `${item.id} ${telegramUserId}`,
                    chatTypes: ['channels', 'groups', 'users'],
                  });
                }}
              >
                <div className="size-5">
                  <IconTelegram />
                </div>
                Send GM Sticker
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});
TopSwiper.displayName = 'TopSwiper';
