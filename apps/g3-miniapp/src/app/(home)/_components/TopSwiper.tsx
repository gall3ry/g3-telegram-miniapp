import { IMAGES } from '@gall3ry/shared-constants';
import { Button } from '@radix-ui/themes';
import { memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { IconTelegram } from '../_icons/IconTelegram';

export const TopSwiper = memo(() => {
  return (
    <div className="mt-6">
      <Swiper className="w-full bg-cover">
        {Object.values(IMAGES.MOCK_STICKER).map((image, index) => (
          <SwiperSlide key={index} className="bg-[#EDFFF4] rounded-lg p-3">
            <div
              style={{
                backgroundImage: `url(${image})`,
              }}
              className="aspect-square w-full bg-cover bg-no-repeat"
            />

            <div className="mt-3">
              <Button size="4" className="w-full">
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
