import { IMAGES } from '@gall3ry/shared-constants';
import Image from 'next/image';
import { IconPoints } from '../_icons/IconPoints';
import { TopSwiper } from './TopSwiper';

export const Top = () => {
  return (
    <div>
      <section className="relative">
        <div
          className="aspect-[375/411] absolute w-full top-0 left-0 bg-cover"
          style={{
            backgroundImage: `url(${IMAGES.home.home_bg})`,
          }}
        ></div>

        <div className="relative">
          <div className="mt-1">
            <div className="h-11 justify-center items-center gap-2 flex">
              <div className="text-center text-slate-900 text-[32px] font-bold leading-[44px]">
                Send Web3 Stickers
              </div>
            </div>

            <div className="h-11 justify-center items-center gap-2 flex">
              <div className="w-9 h-9 relative">
                <IconPoints />
              </div>
              <div className="text-center text-slate-900 text-[32px] font-bold leading-[44px]">
                Get $EPIC
              </div>
            </div>
          </div>

          <TopSwiper />
        </div>
      </section>

      <div className="mt-6">
        <div className="text-center text-xl font-bold leading-7 text-slate-900">
          Hall of EPICs
        </div>
      </div>

      <div className="my-4">
        <div className="relative h-[120px] rounded-xl bg-[#87FFB5] px-5 py-2.5">
          <div className="text-4xl font-bold leading-[44px] text-slate-900">
            1,000 $TON
          </div>
          <div className="text-base font-medium leading-normal tracking-tight text-slate-900">
            FOR THE CHAMPIONS
          </div>
          <div className="inline-flex items-center justify-start gap-1.5">
            <div className="h-2 w-2 rounded-full bg-lime-700" />
            <div className="text-xs font-medium leading-[18px] tracking-tight text-[#005320]">
              The leaders take it all
            </div>
          </div>

          <Image
            src={IMAGES.banner_right_image}
            alt="banner_right_image"
            width={117}
            height={106}
            className="absolute bottom-1.5 right-[14px]"
          />
        </div>
      </div>
    </div>
  );
};

Top.displayName = 'Top';
