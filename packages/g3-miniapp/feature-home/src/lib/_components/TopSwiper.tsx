'use client';
import { Sticker } from '@gall3ry/g3-miniapp-feature-stickers';
import { useWebAppSwitchInlineQuery } from '@gall3ry/g3-miniapp-telegram-miniapp-utils';
import { api } from '@gall3ry/g3-miniapp-trpc-client';
import { Button } from '@radix-ui/themes';
import { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconTelegram } from '../_icons/IconTelegram';

export const TopSwiper = memo(() => {
  const { data } = api.sticker.getTopStickers.useQuery({
    limit: 10,
  });
  const { postSwitchInlineQuery } = useWebAppSwitchInlineQuery();
  const items = data?.items;

  return (
    <div className="mt-6">
      <Swiper
        slidesPerView="auto"
        className="w-full bg-cover"
        centeredSlides
        initialSlide={2}
        spaceBetween={10}
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
              <Sticker sticker={item} shouldRecord={false} />
            </div>

            <div className="mt-3">
              <Button
                size="4"
                className="w-full whitespace-nowrap"
                onClick={() => {
                  postSwitchInlineQuery({
                    query: `${item.id}`,
                    chatTypes: ['channels', 'groups', 'users'],
                  });
                }}
              >
                <div className="size-5">
                  <IconTelegram />
                </div>
                Send Sticker
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
});
TopSwiper.displayName = 'TopSwiper';
